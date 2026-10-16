import type {
  EstadoPedido,
  Pedido,
  PedidoConfirmado,
  SolicitudPedido,
} from "@/domain/pedido";

export interface PedidosRepositorio {
  crear(solicitud: SolicitudPedido): Promise<PedidoConfirmado>;
  listar(estado?: EstadoPedido): Promise<Pedido[]>;
  obtener(id: string): Promise<Pedido>;
  cambiarEstado(id: string, destino: EstadoPedido): Promise<Pedido>;
}
