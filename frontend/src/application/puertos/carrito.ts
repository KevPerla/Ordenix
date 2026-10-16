import type { Carrito } from "@/domain/carrito";

export interface AlmacenCarrito {
  leer(propietario: string): Carrito;
  guardar(propietario: string, carrito: Carrito): void;
  suscribir(alCambiar: () => void): () => void;
}
