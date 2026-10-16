import { ErrorConflicto } from '../../../../shared/domain/errors/error-dominio';

export class ProductoNoDisponibleError extends ErrorConflicto {
  readonly codigo = 'PRODUCTO_NO_DISPONIBLE';

  constructor(nombre: string) {
    super(`${nombre} ya no esta disponible.`, { producto: nombre });
  }
}
