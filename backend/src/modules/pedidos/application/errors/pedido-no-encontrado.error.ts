import { ErrorNoEncontrado } from '../../../../shared/domain/errors/error-dominio';

export class PedidoNoEncontradoError extends ErrorNoEncontrado {
  readonly codigo = 'PEDIDO_NO_ENCONTRADO';

  constructor(id: string) {
    super('El pedido no existe.', { id });
  }
}
