import { redondearMoneda } from "./impuestos";

export type EstadoPedido =
  | "CREADO"
  | "PAGADO"
  | "EN_PREPARACION"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO";

export interface LineaPedido {
  productoId: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CambioEstado {
  estado: EstadoPedido;
  fecha: string;
}

export interface DatosEntrega {
  direccion: string;
  referencia: string | null;
  cliente: string;
  telefono: string;
}

export interface Pedido {
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
  entrega: DatosEntrega;
  lineas: LineaPedido[];
  historial: CambioEstado[];
  createdAt: string;
  updatedAt: string;
}

export interface SolicitudPedido {
  direccionCompleta: string;
  referencia?: string;
  notas?: string;
  lineas: { productoId: string; cantidad: number }[];
}

export interface PedidoConfirmado {
  id: string;
  estado: EstadoPedido;
  subtotal: number;
  impuesto: number;
  total: number;
}

export const RECORRIDO: readonly EstadoPedido[] = [
  "CREADO",
  "PAGADO",
  "EN_PREPARACION",
  "EN_CAMINO",
  "ENTREGADO",
];

export const ETIQUETA_ESTADO: Record<EstadoPedido, string> = {
  CREADO: "Creado",
  PAGADO: "Pagado",
  EN_PREPARACION: "En preparación",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export const ACCION_HACIA: Record<EstadoPedido, string> = {
  CREADO: "Crear",
  PAGADO: "Confirmar pago",
  EN_PREPARACION: "Empezar preparación",
  EN_CAMINO: "Salir a entregar",
  ENTREGADO: "Marcar entregado",
  CANCELADO: "Cancelar pedido",
};

export const DESTINOS_DEL_REPARTIDOR: readonly EstadoPedido[] = [
  "EN_CAMINO",
  "ENTREGADO",
];

export const LONGITUD_MINIMA_DIRECCION = 8;

export function folio(pedido: Pick<Pedido, "id">): string {
  return `#${pedido.id.slice(0, 8).toUpperCase()}`;
}

export function puedeAvanzarA(pedido: Pedido, destino: EstadoPedido): boolean {
  return pedido.estadosPosibles.includes(destino);
}

export function fechaDelEstado(
  pedido: Pedido,
  estado: EstadoPedido,
): string | undefined {
  return pedido.historial.findLast((cambio) => cambio.estado === estado)?.fecha;
}

export function estaActivo(pedido: Pedido): boolean {
  return !pedido.cerrado;
}

export function totalVendido(pedidos: readonly Pedido[]): number {
  return redondearMoneda(
    pedidos
      .filter((pedido) => pedido.estado !== "CANCELADO")
      .reduce((suma, pedido) => suma + pedido.total, 0),
  );
}

export function validarDireccion(direccion: string): string | null {
  return direccion.trim().length < LONGITUD_MINIMA_DIRECCION
    ? "Escribe una dirección más completa: colonia, calle y número"
    : null;
}
