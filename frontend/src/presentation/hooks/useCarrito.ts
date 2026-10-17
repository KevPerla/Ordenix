"use client";

import { useMemo, useSyncExternalStore } from "react";
import { CARRITO_VACIO, resumirCarrito } from "@/domain/carrito";
import type { Producto } from "@/domain/catalogo";
import { carrito as casosCarrito } from "@/infrastructure/contenedor";
import { useAuth } from "@/presentation/contexto/AuthContext";

function accionesPara(propietario: string | undefined) {
  const con = (accion: (id: string) => void) => {
    if (propietario) accion(propietario);
  };

  return {
    agregar: (producto: Producto) =>
      con((id) => casosCarrito.agregar(id, producto)),
    cambiarCantidad: (productoId: string, cantidad: number) =>
      con((id) => casosCarrito.cambiarCantidad(id, productoId, cantidad)),
    quitar: (productoId: string) =>
      con((id) => casosCarrito.quitar(id, productoId)),
    sincronizar: (productos: readonly Producto[]) =>
      con((id) => casosCarrito.sincronizar(id, productos)),
    vaciar: () => con((id) => casosCarrito.vaciar(id)),
  };
}

export function useCarrito() {
  const propietario = useAuth().usuario?.id;

  const lineas = useSyncExternalStore(
    casosCarrito.suscribir,
    () => casosCarrito.leer(propietario),
    () => CARRITO_VACIO,
  );

  const acciones = useMemo(() => accionesPara(propietario), [propietario]);
  const resumen = useMemo(() => resumirCarrito(lineas), [lineas]);

  return { lineas, resumen, ...acciones };
}
