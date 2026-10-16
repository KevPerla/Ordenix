import { ErrorConflicto } from '../../../../shared/domain/errors/error-dominio';

export class CategoriaDuplicadaError extends ErrorConflicto {
  readonly codigo = 'CATEGORIA_DUPLICADA';

  constructor(nombre: string) {
    super('Ya existe una categoria con ese nombre.', { nombre });
  }
}
