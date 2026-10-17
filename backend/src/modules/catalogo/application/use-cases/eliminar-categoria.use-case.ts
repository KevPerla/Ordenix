import type { CategoriaRepository } from '../ports/categoria.repository.port';
import { CategoriaConProductosError } from '../errors/categoria-con-productos.error';
import { CategoriaNoEncontradaError } from '../errors/categoria-no-encontrada.error';

export class EliminarCategoriaUseCase {
  constructor(private readonly repositorio: CategoriaRepository) {}

  async execute(id: string): Promise<void> {
    const categoria = await this.repositorio.findById(id);

    if (!categoria) {
      throw new CategoriaNoEncontradaError(id);
    }

    if (await this.repositorio.tieneProductos(id)) {
      throw new CategoriaConProductosError(id);
    }

    await this.repositorio.delete(id);
  }
}
