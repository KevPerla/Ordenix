export enum EstadoPedido {
  CREADO = 'CREADO',
  PAGADO = 'PAGADO',
  EN_PREPARACION = 'EN_PREPARACION',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export const TRANSICIONES_VALIDAS: Readonly<
  Record<EstadoPedido, readonly EstadoPedido[]>
> = {
  [EstadoPedido.CREADO]: [EstadoPedido.PAGADO, EstadoPedido.CANCELADO],
  [EstadoPedido.PAGADO]: [EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO],
  [EstadoPedido.EN_PREPARACION]: [
    EstadoPedido.EN_CAMINO,
    EstadoPedido.CANCELADO,
  ],
  [EstadoPedido.EN_CAMINO]: [EstadoPedido.ENTREGADO],
  [EstadoPedido.ENTREGADO]: [],
  [EstadoPedido.CANCELADO]: [],
};

export function esEstadoFinal(estado: EstadoPedido): boolean {
  return TRANSICIONES_VALIDAS[estado].length === 0;
}
