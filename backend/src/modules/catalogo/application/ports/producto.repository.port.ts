import type { Producto } from '../../domain/entities/producto.entity';

export const PRODUCTO_REPOSITORY_TOKEN = Symbol('ProductoRepository');

export interface FiltroProductos {
  categoriaId?: string;
  soloDisponibles?: boolean;
  busqueda?: string;
}

export interface ProductoRepository {
  findById(id: string): Promise<Producto | null>;
  findAll(filtro: FiltroProductos): Promise<Producto[]>;
  save(producto: Producto): Promise<Producto>;
  create(datos: {
    categoriaId: string;
    nombre: string;
    descripcion: string | null;
    precio: number;
    imagenUrl: string | null;
    stock: number;
    disponible: boolean;
  }): Promise<Producto>;
  delete(id: string): Promise<void>;
  estaEnAlgunPedido(id: string): Promise<boolean>;
}
