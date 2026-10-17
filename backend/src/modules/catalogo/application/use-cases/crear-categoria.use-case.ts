import type { Categoria } from '../../domain/entities/categoria.entity';
import type { CategoriaRepository } from '../ports/categoria.repository.port';
import { CategoriaDuplicadaError } from '../errors/categoria-duplicada.error';

export interface CrearCategoriaInput {
  nombre: string;
  descripcion: string | null;
}

export class CrearCategoriaUseCase {
  constructor(private readonly repositorio: CategoriaRepository) {}

  async execute(input: CrearCategoriaInput): Promise<Categoria> {
    const existente = await this.repositorio.findByNombre(input.nombre);

    if (existente) {
      throw new CategoriaDuplicadaError(input.nombre);
    }

    return this.repositorio.create(input);
  }
}
