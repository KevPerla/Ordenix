export type Rol = "CLIENTE" | "ADMINISTRADOR" | "REPARTIDOR";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface Credenciales {
  correo: string;
  password: string;
}

export interface DatosRegistro extends Credenciales {
  nombreCompleto: string;
  telefono: string;
}

export interface AreaDeRol {
  rol: Rol;
  area: string;
  lema: string;
  permisos: string[];
}

export function primerNombre(usuario: Usuario | null): string | undefined {
  return usuario?.nombre.split(" ")[0];
}
