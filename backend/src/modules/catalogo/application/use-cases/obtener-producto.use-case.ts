import type { Producto } from '../../domain/entities/producto.entity';
import type { ProductoRepository } from '../../domain/repositories/producto.repository.interface';
import { ProductoNoEncontradoError } from '../errors/producto-no-encontrado.error';

export class ObtenerProductoUseCase {
  constructor(private readonly repositorio: ProductoRepository) {}

  async execute(id: string): Promise<Producto> {
    const producto = await this.repositorio.findById(id);

    if (!producto) {
      throw new ProductoNoEncontradoError(id);
    }

    return producto;
  }
}
