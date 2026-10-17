import { ErrorReglaNegocio } from '../../../../shared/domain/errors/error-dominio';

export class PedidoSinLineasError extends ErrorReglaNegocio {
  readonly codigo = 'PEDIDO_SIN_LINEAS';

  constructor() {
    super('Un pedido debe tener al menos un producto.');
  }
}
