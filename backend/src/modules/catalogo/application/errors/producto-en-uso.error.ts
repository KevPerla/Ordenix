import { ErrorConflicto } from '../../../../shared/domain/errors/error-dominio';

export class ProductoEnUsoError extends ErrorConflicto {
  readonly codigo = 'PRODUCTO_EN_USO';

  constructor(id: string) {
    super(
      'No se puede eliminar un producto que ya aparece en pedidos. Marcalo como no disponible.',
      { id },
    );
  }
}
