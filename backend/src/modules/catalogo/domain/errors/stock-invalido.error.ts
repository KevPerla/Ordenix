import { ErrorReglaNegocio } from '../../../../shared/domain/errors/error-dominio';

export class StockInvalidoError extends ErrorReglaNegocio {
  readonly codigo = 'STOCK_INVALIDO';

  constructor(stock: number) {
    super('El stock debe ser un entero mayor o igual que cero.', { stock });
  }
}
