export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  createdAt: string;
}

export interface Producto {
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

export interface DatosProducto {
  categoriaId: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  disponible: boolean;
}

export interface DatosCategoria {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface FiltroProductos {
  categoriaId?: string;
  soloDisponibles?: boolean;
  busqueda?: string;
}

export type ErroresProducto = Partial<Record<keyof DatosProducto, string>>;

export const UMBRAL_POCAS_UNIDADES = 5;

export function validarProducto(datos: DatosProducto): ErroresProducto {
  const errores: ErroresProducto = {};

  if (!datos.categoriaId) {
    errores.categoriaId = "Elige una categoría";
  }

  if (datos.nombre.trim().length < 2) {
    errores.nombre = "Escribe al menos 2 caracteres";
  }

  if (!Number.isFinite(datos.precio) || datos.precio <= 0) {
    errores.precio = "El precio debe ser mayor que cero";
  }

  if (!Number.isInteger(datos.stock) || datos.stock < 0) {
    errores.stock = "El stock debe ser un entero mayor o igual que cero";
  }

  return errores;
}

export function validarNombreCategoria(nombre: string): string | null {
  return nombre.trim().length < 2 ? "Escribe al menos 2 caracteres" : null;
}

export function estaAgotado(producto: Producto): boolean {
  return producto.stock === 0;
}

export function quedanPocas(producto: Producto): boolean {
  return producto.stock > 0 && producto.stock < UMBRAL_POCAS_UNIDADES;
}
