import { ErrorConflicto } from '../../../../shared/domain/errors/error-dominio';

export class PedidoModificadoError extends ErrorConflicto {
  readonly codigo = 'PEDIDO_MODIFICADO';

  constructor(id: string) {
    super(
      'Otra persona cambio este pedido hace un momento. Actualiza la lista e intenta de nuevo.',
      { id },
    );
  }
}
