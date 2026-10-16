import { PrecioInvalidoError } from '../errors/precio-invalido.error';
import { StockInsuficienteError } from '../errors/stock-insuficiente.error';
import { StockInvalidoError } from '../errors/stock-invalido.error';

export class Producto {
  constructor(
    public readonly id: string,
    public categoriaId: string,
    public nombre: string,
    public descripcion: string | null,
    public precio: number,
    public imagenUrl: string | null,
    public stock: number,
    public disponible: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {
    Producto.validarPrecio(precio);
    Producto.validarStock(stock);
  }

  static validarPrecio(precio: number): void {
    if (!Number.isFinite(precio) || precio <= 0) {
      throw new PrecioInvalidoError(precio);
    }
  }

  static validarStock(stock: number): void {
    if (!Number.isInteger(stock) || stock < 0) {
      throw new StockInvalidoError(stock);
    }
  }

  cambiarPrecio(precio: number): void {
    Producto.validarPrecio(precio);
    this.precio = precio;
    this.updatedAt = new Date();
  }

  ajustarStock(stock: number): void {
    Producto.validarStock(stock);
    this.stock = stock;
    this.updatedAt = new Date();
  }

  hayExistencias(cantidad: number): boolean {
    return this.stock >= cantidad;
  }

  descontar(cantidad: number): void {
    if (!this.hayExistencias(cantidad)) {
      throw new StockInsuficienteError(this.nombre, this.stock, cantidad);
    }

    this.stock -= cantidad;
    this.updatedAt = new Date();
  }
}
