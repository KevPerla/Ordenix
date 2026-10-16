import type { Pedido } from '../../domain/entities/pedido.entity';
import { EstadoPedido } from '../../domain/enums/estado-pedido.enum';
import { AccesoAlPedidoDenegadoError } from '../errors/acceso-al-pedido-denegado.error';
import { PedidoNoEncontradoError } from '../errors/pedido-no-encontrado.error';
import type { PedidoRepository } from '../ports/pedido.repository.port';

export interface ObtenerPedidoInput {
  id: string;
  solicitanteId: string;
  esAdministrador: boolean;
  esRepartidor: boolean;
}

export class ObtenerPedidoUseCase {
  constructor(private readonly repositorio: PedidoRepository) {}

  async execute(input: ObtenerPedidoInput): Promise<Pedido> {
    const pedido = await this.repositorio.findById(input.id);

    if (!pedido) {
      throw new PedidoNoEncontradoError(input.id);
    }

    if (!this.puedeVer(pedido, input)) {
      throw new AccesoAlPedidoDenegadoError();
    }

    return pedido;
  }

  private puedeVer(pedido: Pedido, input: ObtenerPedidoInput): boolean {
    if (input.esAdministrador) {
      return true;
    }

    if (input.esRepartidor) {
      return (
        pedido.repartidorId === input.solicitanteId ||
        (pedido.repartidorId === null &&
          pedido.estado === EstadoPedido.EN_PREPARACION)
      );
    }

    return pedido.clienteId === input.solicitanteId;
  }
}
