import { ErrorProhibido } from '../../../../shared/domain/errors/error-dominio';
import type { EstadoPedido } from '../../domain/enums/estado-pedido.enum';

export class EstadoNoPermitidoError extends ErrorProhibido {
  readonly codigo = 'ESTADO_NO_PERMITIDO';

  constructor(destino: EstadoPedido) {
    super(`Tu rol no puede mover un pedido a ${destino}.`, { destino });
  }
}
