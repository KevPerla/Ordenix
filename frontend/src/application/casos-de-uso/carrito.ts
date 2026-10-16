import {
  agregarProducto,
  cambiarCantidad,
  CARRITO_VACIO,
  quitarProducto,
  sincronizarConCatalogo,
  sonIguales,
  type Carrito,
} from "@/domain/carrito";
import type { Producto } from "@/domain/catalogo";
import type { AlmacenCarrito } from "../puertos/carrito";

export class CasosCarrito {
  constructor(private readonly almacen: AlmacenCarrito) {}

  suscribir = (alCambiar: () => void): (() => void) =>
    this.almacen.suscribir(alCambiar);

  leer(propietario: string | undefined): Carrito {
    return propietario ? this.almacen.leer(propietario) : CARRITO_VACIO;
  }

  agregar(propietario: string, producto: Producto): void {
    this.actualizar(propietario, (carrito) => agregarProducto(carrito, producto));
  }

  cambiarCantidad(propietario: string, productoId: string, cantidad: number): void {
    this.actualizar(propietario, (carrito) =>
      cambiarCantidad(carrito, productoId, cantidad),
    );
  }

  quitar(propietario: string, productoId: string): void {
    this.actualizar(propietario, (carrito) => quitarProducto(carrito, productoId));
  }

  sincronizar(propietario: string, productos: readonly Producto[]): void {
    this.actualizar(propietario, (carrito) =>
      sincronizarConCatalogo(carrito, productos),
    );
  }

  vaciar(propietario: string): void {
    this.almacen.guardar(propietario, CARRITO_VACIO);
  }

  private actualizar(
    propietario: string,
    cambio: (carrito: Carrito) => Carrito,
  ): void {
    const actual = this.almacen.leer(propietario);
    const siguiente = cambio(actual);

    if (!sonIguales(actual, siguiente)) {
      this.almacen.guardar(propietario, siguiente);
    }
  }
}
