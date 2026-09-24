import { ErrorConflicto } from '../../../../shared/domain/errors/error-dominio';

export class CategoriaConProductosError extends ErrorConflicto {
  readonly codigo = 'CATEGORIA_CON_PRODUCTOS';

  constructor(id: string) {
    super(
      'No se puede eliminar una categoria que todavia tiene productos asociados.',
      { id },
    );
  }
}
