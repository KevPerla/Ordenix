import { ILike, type Repository } from 'typeorm';
import { Producto } from '../../domain/entities/producto.entity';
import type {
  FiltroProductos,
  ProductoRepository,
} from '../../application/ports/producto.repository.port';
import { ProductoOrmEntity } from './producto.orm-entity';

interface ConteoFila {
  total: string;
}

export class TypeOrmProductoRepository implements ProductoRepository {
  constructor(private readonly repositorio: Repository<ProductoOrmEntity>) {}

  async findById(id: string): Promise<Producto | null> {
    const fila = await this.repositorio.findOne({ where: { id } });
    return fila ? this.aDominio(fila) : null;
  }

  async findAll(filtro: FiltroProductos): Promise<Producto[]> {
    const condiciones: Record<string, unknown> = {};

    if (filtro.categoriaId) {
      condiciones.categoryId = filtro.categoriaId;
    }

    if (filtro.soloDisponibles) {
      condiciones.disponible = true;
    }

    if (filtro.busqueda) {
      condiciones.nombre = ILike(`%${filtro.busqueda}%`);
    }

    const filas = await this.repositorio.find({
      where: condiciones,
      order: { nombre: 'ASC' },
    });

    return filas.map((fila) => this.aDominio(fila));
  }

  async create(datos: {
    categoriaId: string;
    nombre: string;
    descripcion: string | null;
    precio: number;
    imagenUrl: string | null;
    stock: number;
    disponible: boolean;
  }): Promise<Producto> {
    const fila = this.repositorio.create({
      categoryId: datos.categoriaId,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      precio: datos.precio.toFixed(2),
      imagenUrl: datos.imagenUrl,
      stock: datos.stock,
      disponible: datos.disponible,
    });

    return this.aDominio(await this.repositorio.save(fila));
  }

  async save(producto: Producto): Promise<Producto> {
    await this.repositorio.save({
      id: producto.id,
      categoryId: producto.categoriaId,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.toFixed(2),
      imagenUrl: producto.imagenUrl,
      stock: producto.stock,
      disponible: producto.disponible,
    });

    const actualizado = await this.repositorio.findOne({
      where: { id: producto.id },
    });

    return actualizado ? this.aDominio(actualizado) : producto;
  }

  async delete(id: string): Promise<void> {
    await this.repositorio.delete({ id });
  }

  async estaEnAlgunPedido(id: string): Promise<boolean> {
    const filas = await this.repositorio.manager.query<ConteoFila[]>(
      'SELECT COUNT(*)::text AS total FROM order_items WHERE product_id = $1',
      [id],
    );

    return Number(filas[0]?.total ?? '0') > 0;
  }

  private aDominio(fila: ProductoOrmEntity): Producto {
    return new Producto(
      fila.id,
      fila.categoryId,
      fila.nombre,
      fila.descripcion,
      Number(fila.precio),
      fila.imagenUrl,
      fila.stock,
      fila.disponible,
      fila.createdAt,
      fila.updatedAt,
    );
  }
}
