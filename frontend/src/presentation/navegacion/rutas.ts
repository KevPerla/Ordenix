import type { Rol } from "@/domain/usuario";

export const INICIO_POR_ROL: Record<Rol, string> = {
  CLIENTE: "/cliente",
  ADMINISTRADOR: "/empresa",
  REPARTIDOR: "/repartidor",
};

export const ETIQUETA_ROL: Record<Rol, string> = {
  CLIENTE: "Cliente",
  ADMINISTRADOR: "Administrador",
  REPARTIDOR: "Repartidor",
};

export function inicioDe(rol: Rol | undefined): string {
  return rol ? INICIO_POR_ROL[rol] : "/login";
}
