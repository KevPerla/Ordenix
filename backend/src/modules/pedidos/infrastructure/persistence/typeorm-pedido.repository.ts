import type { DataSource } from 'typeorm';
import { LineaPedido } from '../../domain/entities/linea-pedido.entity';
import {
  Pedido,
  type CambioEstado,
} from '../../domain/entities/pedido.entity';
import { EstadoPedido } from '../../domain/enums/estado-pedido.enum';
import type {
  FiltroPedidos,
  PedidoRepository,
} from '../../application/ports/pedido.repository.port';

interface FilaPedido {
  id: string;
  cliente_id: string;
  repartidor_id: string | null;
  estado: string;
  notas: string | null;
  created_at: Date;
  updated_at: Date;
  direccion: string;
  referencia: string | null;
  cliente: string;
  telefono: string;
}

interface FilaLinea {
  order_id: string;
  product_id: string;
  nombre: string;
  cantidad: number;
  precio_unitario: string;
}

interface FilaHistorial {
  order_id: string;
  estado_nuevo: string;
  changed_at: Date;
}

const SELECCION_PEDIDO = `
  SELECT o.id, o.cliente_id, o.repartidor_id, o.estado, o.notas,
         o.created_at, o.updated_at,
         a.direccion_completa AS direccion, a.referencia,
         u.nombre_completo AS cliente, u.telefono
    FROM orders o
    JOIN addresses a ON a.id = o.address_id
    JOIN users u ON u.id = o.cliente_id`;

export class TypeOrmPedidoRepository implements PedidoRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: string): Promise<Pedido | null> {
    const filas = await this.dataSource.query<FilaPedido[]>(
      `${SELECCION_PEDIDO} WHERE o.id = $1`,
      [id],
    );

    if (filas.length === 0) {
      return null;
    }

    const [pedido] = await this.aDominio(filas);
    return pedido;
  }

  async findAll(filtro: FiltroPedidos): Promise<Pedido[]> {
    const condiciones: string[] = [];
    const parametros: unknown[] = [];

    if (filtro.clienteId) {
      parametros.push(filtro.clienteId);
      condiciones.push(`o.cliente_id = $${parametros.length}`);
    }

    if (filtro.visiblesParaRepartidor) {
      parametros.push(filtro.visiblesParaRepartidor, EstadoPedido.EN_PREPARACION);
      condiciones.push(
        `(o.repartidor_id = $${parametros.length - 1}
          OR (o.repartidor_id IS NULL AND o.estado = $${parametros.length}))`,
      );
    }

    if (filtro.estado) {
      parametros.push(filtro.estado);
      condiciones.push(`o.estado = $${parametros.length}`);
    }

    const donde =
      condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';

    const filas = await this.dataSource.query<FilaPedido[]>(
      `${SELECCION_PEDIDO}
       ${donde}
       ORDER BY o.created_at DESC
       LIMIT 100`,
      parametros,
    );

    return this.aDominio(filas);
  }

  async guardarCambioEstado(
    pedido: Pedido,
    anterior: EstadoPedido,
    usuarioId: string,
  ): Promise<boolean> {
    return this.dataSource.transaction(async (manager) => {
      const [, afectadas] = await manager.query<[unknown[], number]>(
        `UPDATE orders
            SET estado = $2,
                repartidor_id = $3,
                updated_at = now()
          WHERE id = $1
            AND estado = $4`,
        [pedido.id, pedido.estado, pedido.repartidorId, anterior],
      );

      if (afectadas === 0) {
        return false;
      }

      await manager.query(
        `INSERT INTO order_status_history
           (order_id, estado_anterior, estado_nuevo, changed_by)
         VALUES ($1, $2, $3, $4)`,
        [pedido.id, anterior, pedido.estado, usuarioId],
      );

      return true;
    });
  }

  private async aDominio(filas: FilaPedido[]): Promise<Pedido[]> {
    if (filas.length === 0) {
      return [];
    }

    const ids = filas.map((fila) => fila.id);
    const [lineas, historial] = await Promise.all([
      this.cargarLineas(ids),
      this.cargarHistorial(ids),
    ]);

    return filas.map(
      (fila) =>
        new Pedido({
          id: fila.id,
          clienteId: fila.cliente_id,
          repartidorId: fila.repartidor_id,
          estado: fila.estado as EstadoPedido,
          lineas: lineas.get(fila.id) ?? [],
          entrega: {
            direccion: fila.direccion,
            referencia: fila.referencia,
            cliente: fila.cliente,
            telefono: fila.telefono,
          },
          historial: historial.get(fila.id) ?? [],
          notas: fila.notas,
          createdAt: fila.created_at,
          updatedAt: fila.updated_at,
        }),
    );
  }

  private async cargarLineas(
    pedidoIds: string[],
  ): Promise<Map<string, LineaPedido[]>> {
    const filas = await this.dataSource.query<FilaLinea[]>(
      `SELECT oi.order_id, oi.product_id, p.nombre, oi.cantidad,
              oi.precio_unitario
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = ANY($1::uuid[])
        ORDER BY p.nombre`,
      [pedidoIds],
    );

    return agrupar(
      filas,
      (fila) => fila.order_id,
      (fila) =>
        new LineaPedido(
          fila.product_id,
          fila.nombre,
          fila.cantidad,
          Number(fila.precio_unitario),
        ),
    );
  }

  private async cargarHistorial(
    pedidoIds: string[],
  ): Promise<Map<string, CambioEstado[]>> {
    const filas = await this.dataSource.query<FilaHistorial[]>(
      `SELECT order_id, estado_nuevo, changed_at
         FROM order_status_history
        WHERE order_id = ANY($1::uuid[])
        ORDER BY changed_at`,
      [pedidoIds],
    );

    return agrupar(
      filas,
      (fila) => fila.order_id,
      (fila) => ({
        estado: fila.estado_nuevo as EstadoPedido,
        fecha: fila.changed_at,
      }),
    );
  }
}

function agrupar<F, V>(
  filas: F[],
  clave: (fila: F) => string,
  valor: (fila: F) => V,
): Map<string, V[]> {
  const mapa = new Map<string, V[]>();

  for (const fila of filas) {
    const grupo = mapa.get(clave(fila));

    if (grupo) {
      grupo.push(valor(fila));
    } else {
      mapa.set(clave(fila), [valor(fila)]);
    }
  }

  return mapa;
}
