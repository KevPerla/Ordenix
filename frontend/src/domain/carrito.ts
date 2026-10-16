import type { Producto } from "./catalogo";
import { agregarIva, calcularIva, redondearMoneda } from "./impuestos";

export interface LineaCarrito {
  productoId: string;
  nombre: string;
  precioSinIva: number;
  stock: number;
  cantidad: number;
}

export type Carrito = readonly LineaCarrito[];

export interface ResumenCarrito {
  unidades: number;
  subtotal: number;
  iva: number;
  total: number;
}

export const CARRITO_VACIO: Carrito = [];

function acotar(cantidad: number, stock: number): number {
  return Math.max(0, Math.min(Math.trunc(cantidad), stock));
}

export function cantidadEnCarrito(carrito: Carrito, productoId: string): number {
  return carrito.find((linea) => linea.productoId === productoId)?.cantidad ?? 0;
}

export function puedeAgregar(carrito: Carrito, producto: Producto): boolean {
  return (
    producto.disponible &&
    cantidadEnCarrito(carrito, producto.id) < producto.stock
  );
}

export function agregarProducto(
  carrito: Carrito,
  producto: Producto,
  cantidad = 1,
): Carrito {
  if (!puedeAgregar(carrito, producto)) {
    return carrito;
  }

  const existente = carrito.find((linea) => linea.productoId === producto.id);

  if (!existente) {
    return [
      ...carrito,
      {
        productoId: producto.id,
        nombre: producto.nombre,
        precioSinIva: producto.precioSinIva,
        stock: producto.stock,
        cantidad: acotar(cantidad, producto.stock),
      },
    ];
  }

  return cambiarCantidad(carrito, producto.id, existente.cantidad + cantidad);
}

export function cambiarCantidad(
  carrito: Carrito,
  productoId: string,
  cantidad: number,
): Carrito {
  return carrito
    .map((linea) =>
      linea.productoId === productoId
        ? { ...linea, cantidad: acotar(cantidad, linea.stock) }
        : linea,
    )
    .filter((linea) => linea.cantidad > 0);
}

export function quitarProducto(carrito: Carrito, productoId: string): Carrito {
  return carrito.filter((linea) => linea.productoId !== productoId);
}

export function sincronizarConCatalogo(
  carrito: Carrito,
  productos: readonly Producto[],
): Carrito {
  const vigentes = new Map(productos.map((producto) => [producto.id, producto]));

  return carrito
    .map((linea) => {
      const producto = vigentes.get(linea.productoId);

      if (!producto || !producto.disponible) {
        return null;
      }

      return {
        productoId: producto.id,
        nombre: producto.nombre,
        precioSinIva: producto.precioSinIva,
        stock: producto.stock,
        cantidad: acotar(linea.cantidad, producto.stock),
      };
    })
    .filter((linea): linea is LineaCarrito => linea !== null && linea.cantidad > 0);
}

export function precioConIva(linea: LineaCarrito): number {
  return agregarIva(linea.precioSinIva);
}

export function ivaUnitario(linea: LineaCarrito): number {
  return calcularIva(linea.precioSinIva);
}

export function subtotalLinea(linea: LineaCarrito): number {
  return redondearMoneda(linea.precioSinIva * linea.cantidad);
}

export function resumirCarrito(carrito: Carrito): ResumenCarrito {
  const subtotal = redondearMoneda(
    carrito.reduce((suma, linea) => suma + subtotalLinea(linea), 0),
  );

  return {
    unidades: carrito.reduce((suma, linea) => suma + linea.cantidad, 0),
    subtotal,
    iva: calcularIva(subtotal),
    total: agregarIva(subtotal),
  };
}

export function sonIguales(a: Carrito, b: Carrito): boolean {
  return (
    a.length === b.length &&
    a.every(
      (linea, indice) =>
        linea.productoId === b[indice].productoId &&
        linea.cantidad === b[indice].cantidad &&
        linea.precioSinIva === b[indice].precioSinIva &&
        linea.stock === b[indice].stock &&
        linea.nombre === b[indice].nombre,
    )
  );
}
