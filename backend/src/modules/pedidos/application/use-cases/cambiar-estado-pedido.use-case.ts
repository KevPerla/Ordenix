import type { Pedido } from '../../domain/entities/pedido.entity';
import { EstadoPedido } from '../../domain/enums/estado-pedido.enum';
import { AccesoAlPedidoDenegadoError } from '../errors/acceso-al-pedido-denegado.error';
import { EstadoNoPermitidoError } from '../errors/estado-no-permitido.error';
import { PedidoModificadoError } from '../errors/pedido-modificado.error';
import { PedidoNoEncontradoError } from '../errors/pedido-no-encontrado.error';
import type { PedidoRepository } from '../ports/pedido.repository.port';

const DESTINOS_DEL_REPARTIDOR: readonly EstadoPedido[] = [
  EstadoPedido.EN_CAMINO,
  EstadoPedido.ENTREGADO,
];

export interface CambiarEstadoInput {
  pedidoId: string;
  destino: EstadoPedido;
  usuarioId: string;
  esRepartidor: boolean;
}

export class CambiarEstadoPedidoUseCase {
  constructor(private readonly repositorio: PedidoRepository) {}

  async execute(input: CambiarEstadoInput): Promise<Pedido> {
    const pedido = await this.repositorio.findById(input.pedidoId);

    if (!pedido) {
      throw new PedidoNoEncontradoError(input.pedidoId);
    }

    if (input.esRepartidor) {
      this.verificarRepartidor(pedido, input);
    }

    const anterior = pedido.cambiarEstado(input.destino);

    if (input.esRepartidor && input.destino === EstadoPedido.EN_CAMINO) {
      pedido.asignarRepartidor(input.usuarioId);
    }

    const guardado = await this.repositorio.guardarCambioEstado(
      pedido,
      anterior,
      input.usuarioId,
    );

    if (!guardado) {
      throw new PedidoModificadoError(pedido.id);
    }

    return pedido;
  }

  private verificarRepartidor(pedido: Pedido, input: CambiarEstadoInput): void {
    if (!DESTINOS_DEL_REPARTIDOR.includes(input.destino)) {
      throw new EstadoNoPermitidoError(input.destino);
    }

    if (pedido.repartidorId && pedido.repartidorId !== input.usuarioId) {
      throw new AccesoAlPedidoDenegadoError();
    }
  }
}
