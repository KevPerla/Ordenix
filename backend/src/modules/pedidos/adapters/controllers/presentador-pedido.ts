import type { Pedido } from '../../domain/entities/pedido.entity';
import type { EstadoPedido } from '../../domain/enums/estado-pedido.enum';

export interface PedidoResponse {
  id: string;
  clienteId: string;
  repartidorId: string | null;
  estado: EstadoPedido;
  estadosPosibles: EstadoPedido[];
  cerrado: boolean;
  subtotal: number;
  impuesto: number;
  total: number;
  unidades: number;
  notas: string | null;
  entrega: {
    direccion: string;
    referencia: string | null;
    cliente: string;
    telefono: string;
  };
  lineas: {
    productoId: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
  historial: {
    estado: EstadoPedido;
    fecha: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export function presentarPedido(pedido: Pedido): PedidoResponse {
  return {
    id: pedido.id,
    clienteId: pedido.clienteId,
    repartidorId: pedido.repartidorId,
    estado: pedido.estado,
    estadosPosibles: [...pedido.transicionesPosibles()],
    cerrado: pedido.estaCerrado(),
    subtotal: pedido.subtotal,
    impuesto: pedido.impuesto,
    total: pedido.total,
    unidades: pedido.unidades,
    notas: pedido.notas,
    entrega: { ...pedido.entrega },
    lineas: pedido.lineas.map((linea) => ({
      productoId: linea.productoId,
      nombre: linea.nombreProducto,
      cantidad: linea.cantidad,
      precioUnitario: linea.precioUnitario,
      subtotal: linea.subtotal,
    })),
    historial: pedido.historial.map((cambio) => ({
      estado: cambio.estado,
      fecha: cambio.fecha.toISOString(),
    })),
    createdAt: pedido.createdAt.toISOString(),
    updatedAt: pedido.updatedAt.toISOString(),
  };
}
