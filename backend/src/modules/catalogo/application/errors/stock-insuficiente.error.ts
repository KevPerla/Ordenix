import { ErrorConflicto } from '../../../../shared/domain/errors/error-dominio';

export class StockInsuficienteError extends ErrorConflicto {
  readonly codigo = 'STOCK_INSUFICIENTE';

  constructor(producto: string, disponible: number, solicitado: number) {
    super(
      `No hay existencias suficientes de ${producto}. Quedan ${disponible} y se solicitaron ${solicitado}.`,
      { producto, disponible, solicitado },
    );
  }
}
