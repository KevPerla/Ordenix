import { ErrorNoEncontrado } from '../../../../shared/domain/errors/error-dominio';

export class CategoriaNoEncontradaError extends ErrorNoEncontrado {
  readonly codigo = 'CATEGORIA_NO_ENCONTRADA';

  constructor(id: string) {
    super('La categoria no existe.', { id });
  }
}
