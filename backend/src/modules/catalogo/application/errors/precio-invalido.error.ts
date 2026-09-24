import { ErrorReglaNegocio } from '../../../../shared/domain/errors/error-dominio';

export class PrecioInvalidoError extends ErrorReglaNegocio {
  readonly codigo = 'PRECIO_INVALIDO';

  constructor(precio: number) {
    super('El precio debe ser mayor que cero.', { precio });
  }
}
