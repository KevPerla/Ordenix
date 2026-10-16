import type { Categoria } from '../../domain/entities/categoria.entity';
import type { CategoriaRepository } from '../../domain/repositories/categoria.repository.interface';

export class ListarCategoriasUseCase {
  constructor(private readonly repositorio: CategoriaRepository) {}

  execute(soloActivas: boolean): Promise<Categoria[]> {
    return this.repositorio.findAll(soloActivas);
  }
}
