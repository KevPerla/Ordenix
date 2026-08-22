export type Rol = "CLIENTE" | "ADMINISTRADOR" | "REPARTIDOR";

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}