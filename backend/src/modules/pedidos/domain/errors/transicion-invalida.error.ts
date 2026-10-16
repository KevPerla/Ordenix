import { ErrorConflicto } from '../../../../shared/domain/errors/error-dominio';
import type { EstadoPedido } from '../../domain/enums/estado-pedido.enum';

export class TransicionInvalidaError extends ErrorConflicto {
  readonly codigo = 'TRANSICION_INVALIDA';

  constructor(
    origen: EstadoPedido,
    destino: EstadoPedido,
    permitidas: readonly EstadoPedido[],
  ) {
    super(
      permitidas.length === 0
        ? `El pedido ya esta en estado ${origen} y no admite mas cambios.`
        : `No se puede pasar de ${origen} a ${destino}. Desde ${origen} solo se permite: ${permitidas.join(', ')}.`,
      { origen, destino, permitidas },
    );
  }
}
