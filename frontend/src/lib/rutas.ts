import type { Rol } from "@/types/auth";

export const INICIO_POR_ROL: Record<Rol, string> = {
  CLIENTE: "/cliente",
  ADMINISTRADOR: "/empresa",
  REPARTIDOR: "/repartidor",
};

export const AREA_POR_ROL: Record<Rol, string> = {
  CLIENTE: "/areas/cliente",
  ADMINISTRADOR: "/areas/administracion",
  REPARTIDOR: "/areas/reparto",
};

export const ETIQUETA_ROL: Record<Rol, string> = {
  CLIENTE: "Cliente",
  ADMINISTRADOR: "Administrador",
  REPARTIDOR: "Repartidor",
};

export function inicioDe(rol: Rol | undefined): string {
  return rol ? INICIO_POR_ROL[rol] : "/login";
}
