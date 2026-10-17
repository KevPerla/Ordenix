import type { ProductoRepository } from '../ports/producto.repository.port';
import { ProductoEnUsoError } from '../errors/producto-en-uso.error';
import { ProductoNoEncontradoError } from '../errors/producto-no-encontrado.error';

export class EliminarProductoUseCase {
  constructor(private readonly repositorio: ProductoRepository) {}

  async execute(id: string): Promise<void> {
    const producto = await this.repositorio.findById(id);

    if (!producto) {
      throw new ProductoNoEncontradoError(id);
    }

    if (await this.repositorio.estaEnAlgunPedido(id)) {
      throw new ProductoEnUsoError(id);
    }

    await this.repositorio.delete(id);
  }
}
