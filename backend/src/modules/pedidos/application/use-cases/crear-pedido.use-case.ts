import { StockInsuficienteError } from '../../../catalogo/domain/errors/stock-insuficiente.error';
import {
  agregarIva,
  calcularIva,
  redondearMoneda,
} from '../../../../shared/domain/impuestos';
import { EstadoPedido } from '../../domain/enums/estado-pedido.enum';
import { LineasDuplicadasError } from '../errors/lineas-duplicadas.error';
import { PedidoSinLineasError } from '../../domain/errors/pedido-sin-lineas.error';
import { ProductoNoDisponibleError } from '../errors/producto-no-disponible.error';
import { ProductoNoEncontradoError } from '../../../catalogo/application/errors/producto-no-encontrado.error';
import type {
  LineaAPersistir,
  UnidadDeTrabajo,
} from '../ports/unidad-de-trabajo.port';

export interface LineaSolicitada {
  productoId: string;
  cantidad: number;
}

export interface CrearPedidoInput {
  clienteId: string;
  direccionCompleta: string;
  referencia: string | null;
  notas: string | null;
  lineas: LineaSolicitada[];
}

export interface PedidoCreado {
  id: string;
  estado: EstadoPedido;
  subtotal: number;
  impuesto: number;
  total: number;
  lineas: {
    productoId: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
}

export class CrearPedidoUseCase {
  constructor(private readonly unidadDeTrabajo: UnidadDeTrabajo) {}

  async execute(input: CrearPedidoInput): Promise<PedidoCreado> {
    if (input.lineas.length === 0) {
      throw new PedidoSinLineasError();
    }

    const vistos = new Set<string>();
    for (const linea of input.lineas) {
      if (vistos.has(linea.productoId)) {
        throw new LineasDuplicadasError(linea.productoId);
      }
      vistos.add(linea.productoId);
    }

    return this.unidadDeTrabajo.ejecutar(async (contexto) => {
      const ids = input.lineas.map((linea) => linea.productoId).sort();
      const bloqueados = await contexto.bloquearProductos(ids);
      const porId = new Map(bloqueados.map((fila) => [fila.id, fila]));

      const detalle: PedidoCreado['lineas'] = [];
      const aPersistir: LineaAPersistir[] = [];

      for (const linea of input.lineas) {
        const producto = porId.get(linea.productoId);

        if (!producto) {
          throw new ProductoNoEncontradoError(linea.productoId);
        }

        if (!producto.disponible) {
          throw new ProductoNoDisponibleError(producto.nombre);
        }

        if (producto.stock < linea.cantidad) {
          throw new StockInsuficienteError(
            producto.nombre,
            producto.stock,
            linea.cantidad,
          );
        }

        await contexto.descontarStock(producto.id, linea.cantidad);

        detalle.push({
          productoId: producto.id,
          nombre: producto.nombre,
          cantidad: linea.cantidad,
          precioUnitario: producto.precio,
          subtotal: redondearMoneda(producto.precio * linea.cantidad),
        });

        aPersistir.push({
          productoId: producto.id,
          cantidad: linea.cantidad,
          precioUnitario: producto.precio,
        });
      }

      const subtotal = redondearMoneda(
        detalle.reduce((total, linea) => total + linea.subtotal, 0),
      );
      const impuesto = calcularIva(subtotal);
      const total = agregarIva(subtotal);

      const direccionId = await contexto.asegurarDireccion(
        input.clienteId,
        input.direccionCompleta,
        input.referencia,
      );

      const pedidoId = await contexto.insertarPedido({
        clienteId: input.clienteId,
        direccionId,
        estado: EstadoPedido.CREADO,
        subtotal,
        impuesto,
        total,
        notas: input.notas,
      });

      await contexto.insertarLineas(pedidoId, aPersistir);

      await contexto.registrarCambioEstado(
        pedidoId,
        null,
        EstadoPedido.CREADO,
        input.clienteId,
      );

      return {
        id: pedidoId,
        estado: EstadoPedido.CREADO,
        subtotal,
        impuesto,
        total,
        lineas: detalle,
      };
    });
  }
}
