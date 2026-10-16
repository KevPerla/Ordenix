import { agregarIva, calcularIva, redondearMoneda } from '../../../../shared/domain/impuestos';
import type { Categoria } from '../../domain/entities/categoria.entity';
import type { Producto } from '../../domain/entities/producto.entity';

export interface CategoriaResponse {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  createdAt: string;
}

export interface ProductoResponse {
  id: string;
  categoriaId: string;
  nombre: string;
  descripcion: string | null;
  precioSinIva: number;
  iva: number;
  precioConIva: number;
  imagenUrl: string | null;
  stock: number;
  disponible: boolean;
  createdAt: string;
  updatedAt: string;
}

export function presentarCategoria(categoria: Categoria): CategoriaResponse {
  return {
    id: categoria.id,
    nombre: categoria.nombre,
    descripcion: categoria.descripcion,
    activo: categoria.activo,
    createdAt: categoria.createdAt.toISOString(),
  };
}

export function presentarProducto(producto: Producto): ProductoResponse {
  return {
    id: producto.id,
    categoriaId: producto.categoriaId,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precioSinIva: redondearMoneda(producto.precio),
    iva: calcularIva(producto.precio),
    precioConIva: agregarIva(producto.precio),
    imagenUrl: producto.imagenUrl,
    stock: producto.stock,
    disponible: producto.disponible,
    createdAt: producto.createdAt.toISOString(),
    updatedAt: producto.updatedAt.toISOString(),
  };
}
