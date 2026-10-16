import { ErrorReglaNegocio } from '../../../../shared/domain/errors/error-dominio';

export class LineasDuplicadasError extends ErrorReglaNegocio {
  readonly codigo = 'LINEAS_DUPLICADAS';

  constructor(productoId: string) {
    super('Cada producto puede aparecer una sola vez en el pedido.', {
      productoId,
    });
  }
}
