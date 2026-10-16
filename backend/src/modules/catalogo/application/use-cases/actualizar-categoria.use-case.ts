import type { Categoria } from '../../domain/entities/categoria.entity';
import type { CategoriaRepository } from '../ports/categoria.repository.port';
import { CategoriaDuplicadaError } from '../errors/categoria-duplicada.error';
import { CategoriaNoEncontradaError } from '../errors/categoria-no-encontrada.error';

export interface ActualizarCategoriaInput {
  id: string;
  nombre?: string;
  descripcion?: string | null;
  activo?: boolean;
}

export class ActualizarCategoriaUseCase {
  constructor(private readonly repositorio: CategoriaRepository) {}

  async execute(input: ActualizarCategoriaInput): Promise<Categoria> {
    const categoria = await this.repositorio.findById(input.id);

    if (!categoria) {
      throw new CategoriaNoEncontradaError(input.id);
    }

    if (input.nombre && input.nombre !== categoria.nombre) {
      const duplicada = await this.repositorio.findByNombre(input.nombre);

      if (duplicada) {
        throw new CategoriaDuplicadaError(input.nombre);
      }

      categoria.renombrar(input.nombre);
    }

    if (input.descripcion !== undefined) {
      categoria.describir(input.descripcion);
    }

    if (input.activo !== undefined) {
      if (input.activo) {
        categoria.activar();
      } else {
        categoria.desactivar();
      }
    }

    return this.repositorio.save(categoria);
  }
}
