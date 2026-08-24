export type Rol =
  | "CLIENTE"
  | "ADMINISTRADOR"
  | "REPARTIDOR";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}
