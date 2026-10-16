import { redondearMoneda } from '../../../../shared/domain/impuestos';

export class LineaPedido {
  constructor(
    public readonly productoId: string,
    public readonly nombreProducto: string,
    public readonly cantidad: number,
    public readonly precioUnitario: number,
  ) {}

  get subtotal(): number {
    return redondearMoneda(this.cantidad * this.precioUnitario);
  }
}
