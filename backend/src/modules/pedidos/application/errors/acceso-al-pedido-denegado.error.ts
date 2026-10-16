import { ErrorProhibido } from '../../../../shared/domain/errors/error-dominio';

export class AccesoAlPedidoDenegadoError extends ErrorProhibido {
  readonly codigo = 'ACCESO_AL_PEDIDO_DENEGADO';

  constructor() {
    super('Este pedido no te pertenece.');
  }
}
