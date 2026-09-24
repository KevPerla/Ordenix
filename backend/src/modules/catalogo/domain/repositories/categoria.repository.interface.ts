import type { Categoria } from '../entities/categoria.entity';

export interface CategoriaRepository {
  findById(id: string): Promise<Categoria | null>;
  findByNombre(nombre: string): Promise<Categoria | null>;
  findAll(soloActivas: boolean): Promise<Categoria[]>;
  save(categoria: Categoria): Promise<Categoria>;
  create(datos: {
    nombre: string;
    descripcion: string | null;
  }): Promise<Categoria>;
  delete(id: string): Promise<void>;
  tieneProductos(id: string): Promise<boolean>;
}
