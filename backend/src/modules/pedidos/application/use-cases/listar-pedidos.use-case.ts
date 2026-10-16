import type { Pedido } from '../../domain/entities/pedido.entity';
import type {
  FiltroPedidos,
  PedidoRepository,
} from '../ports/pedido.repository.port';

export class ListarPedidosUseCase {
  constructor(private readonly repositorio: PedidoRepository) {}

  execute(filtro: FiltroPedidos): Promise<Pedido[]> {
    return this.repositorio.findAll(filtro);
  }
}
