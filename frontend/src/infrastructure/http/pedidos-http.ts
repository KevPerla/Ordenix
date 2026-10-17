import type { PedidosRepositorio } from "@/application/puertos/pedidos";
import type {
  EstadoPedido,
  Pedido,
  PedidoConfirmado,
  SolicitudPedido,
} from "@/domain/pedido";
import type { ClienteHttp } from "./cliente-http";

export class PedidosHttp implements PedidosRepositorio {
  constructor(private readonly http: ClienteHttp) {}

  crear(solicitud: SolicitudPedido): Promise<PedidoConfirmado> {
    return this.http.post("/pedidos", solicitud);
  }

  listar(estado?: EstadoPedido): Promise<Pedido[]> {
    return this.http.get(`/pedidos${estado ? `?estado=${estado}` : ""}`);
  }

  obtener(id: string): Promise<Pedido> {
    return this.http.get(`/pedidos/${id}`);
  }

  cambiarEstado(id: string, destino: EstadoPedido): Promise<Pedido> {
    return this.http.patch(`/pedidos/${id}/estado`, { estado: destino });
  }
}
