import type { DataSource, EntityManager } from 'typeorm';
import type { EstadoPedido } from '../../domain/enums/estado-pedido.enum';
import type {
  CabeceraAPersistir,
  ContextoTransaccional,
  LineaAPersistir,
  ProductoBloqueado,
  UnidadDeTrabajo,
} from '../../application/ports/unidad-de-trabajo.port';

interface FilaProducto {
  id: string;
  nombre: string;
  precio: string;
  stock: number;
  disponible: boolean;
}

interface FilaId {
  id: string;
}

class ContextoTypeOrm implements ContextoTransaccional {
  constructor(private readonly manager: EntityManager) {}

  async bloquearProductos(ids: string[]): Promise<ProductoBloqueado[]> {
    if (ids.length === 0) {
      return [];
    }

    const filas = await this.manager.query<FilaProducto[]>(
      `SELECT id, nombre, precio, stock, disponible
         FROM products
        WHERE id = ANY($1::uuid[])
        ORDER BY id
          FOR UPDATE`,
      [ids],
    );

    return filas.map((fila) => ({
      id: fila.id,
      nombre: fila.nombre,
      precio: Number(fila.precio),
      stock: fila.stock,
      disponible: fila.disponible,
    }));
  }

  async descontarStock(productoId: string, cantidad: number): Promise<void> {
    await this.manager.query(
      `UPDATE products
          SET stock = stock - $2,
              updated_at = now()
        WHERE id = $1`,
      [productoId, cantidad],
    );
  }

  async asegurarDireccion(
    clienteId: string,
    direccionCompleta: string,
    referencia: string | null,
  ): Promise<string> {
    const existentes = await this.manager.query<FilaId[]>(
      `SELECT id FROM addresses
        WHERE user_id = $1 AND direccion_completa = $2
        LIMIT 1`,
      [clienteId, direccionCompleta],
    );

    if (existentes.length > 0) {
      return existentes[0].id;
    }

    const creadas = await this.manager.query<FilaId[]>(
      `INSERT INTO addresses (user_id, direccion_completa, referencia, es_principal)
       VALUES ($1, $2, $3, FALSE)
       RETURNING id`,
      [clienteId, direccionCompleta, referencia],
    );

    return creadas[0].id;
  }

  async insertarPedido(cabecera: CabeceraAPersistir): Promise<string> {
    const filas = await this.manager.query<FilaId[]>(
      `INSERT INTO orders
         (cliente_id, address_id, estado, subtotal, impuesto, total, notas)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        cabecera.clienteId,
        cabecera.direccionId,
        cabecera.estado,
        cabecera.subtotal,
        cabecera.impuesto,
        cabecera.total,
        cabecera.notas,
      ],
    );

    return filas[0].id;
  }

  async insertarLineas(
    pedidoId: string,
    lineas: LineaAPersistir[],
  ): Promise<void> {
    for (const linea of lineas) {
      await this.manager.query(
        `INSERT INTO order_items (order_id, product_id, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, linea.productoId, linea.cantidad, linea.precioUnitario],
      );
    }
  }

  async registrarCambioEstado(
    pedidoId: string,
    anterior: EstadoPedido | null,
    nuevo: EstadoPedido,
    usuarioId: string | null,
  ): Promise<void> {
    await this.manager.query(
      `INSERT INTO order_status_history
         (order_id, estado_anterior, estado_nuevo, changed_by)
       VALUES ($1, $2, $3, $4)`,
      [pedidoId, anterior, nuevo, usuarioId],
    );
  }
}

export class TypeOrmUnidadDeTrabajo implements UnidadDeTrabajo {
  constructor(private readonly dataSource: DataSource) {}

  ejecutar<T>(
    trabajo: (contexto: ContextoTransaccional) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction('READ COMMITTED', (manager) =>
      trabajo(new ContextoTypeOrm(manager)),
    );
  }
}
