import { ErrorNoEncontrado } from '../../../../shared/domain/errors/error-dominio';

export class ProductoNoEncontradoError extends ErrorNoEncontrado {
  readonly codigo = 'PRODUCTO_NO_ENCONTRADO';

  constructor(id: string) {
    super('El producto no existe.', { id });
  }
}
