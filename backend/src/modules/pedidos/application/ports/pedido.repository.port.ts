import type { Pedido } from '../../domain/entities/pedido.entity';
import type { EstadoPedido } from '../../domain/enums/estado-pedido.enum';

export const PEDIDO_REPOSITORY_TOKEN = Symbol('PedidoRepository');

export interface FiltroPedidos {
  clienteId?: string;
  visiblesParaRepartidor?: string;
  estado?: EstadoPedido;
}

export interface PedidoRepository {
  findById(id: string): Promise<Pedido | null>;
  findAll(filtro: FiltroPedidos): Promise<Pedido[]>;
  guardarCambioEstado(
    pedido: Pedido,
    anterior: EstadoPedido,
    usuarioId: string,
  ): Promise<boolean>;
}
