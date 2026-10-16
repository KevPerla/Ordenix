import type { Repository } from 'typeorm';
import { Categoria } from '../../domain/entities/categoria.entity';
import type { CategoriaRepository } from '../../application/ports/categoria.repository.port';
import { CategoriaOrmEntity } from './categoria.orm-entity';
import { ProductoOrmEntity } from './producto.orm-entity';

export class TypeOrmCategoriaRepository implements CategoriaRepository {
  constructor(
    private readonly repositorio: Repository<CategoriaOrmEntity>,
    private readonly productos: Repository<ProductoOrmEntity>,
  ) {}

  async findById(id: string): Promise<Categoria | null> {
    const fila = await this.repositorio.findOne({ where: { id } });
    return fila ? this.aDominio(fila) : null;
  }

  async findByNombre(nombre: string): Promise<Categoria | null> {
    const fila = await this.repositorio.findOne({ where: { nombre } });
    return fila ? this.aDominio(fila) : null;
  }

  async findAll(soloActivas: boolean): Promise<Categoria[]> {
    const filas = await this.repositorio.find({
      where: soloActivas ? { activo: true } : {},
      order: { nombre: 'ASC' },
    });

    return filas.map((fila) => this.aDominio(fila));
  }

  async create(datos: {
    nombre: string;
    descripcion: string | null;
  }): Promise<Categoria> {
    const fila = this.repositorio.create({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      activo: true,
    });

    return this.aDominio(await this.repositorio.save(fila));
  }

  async save(categoria: Categoria): Promise<Categoria> {
    const fila = await this.repositorio.save({
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      activo: categoria.activo,
    });

    const actualizada = await this.repositorio.findOne({
      where: { id: fila.id },
    });

    return this.aDominio(actualizada ?? (fila as CategoriaOrmEntity));
  }

  async delete(id: string): Promise<void> {
    await this.repositorio.delete({ id });
  }

  async tieneProductos(id: string): Promise<boolean> {
    const total = await this.productos.count({ where: { categoryId: id } });
    return total > 0;
  }

  private aDominio(fila: CategoriaOrmEntity): Categoria {
    return new Categoria(
      fila.id,
      fila.nombre,
      fila.descripcion,
      fila.activo,
      fila.createdAt,
    );
  }
}
