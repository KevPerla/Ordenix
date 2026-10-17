import type {
  AreaDeRol,
  Credenciales,
  DatosRegistro,
  Rol,
  Usuario,
} from "@/domain/usuario";

export interface SesionIniciada {
  token: string;
  usuario: Usuario;
}

export interface AutenticacionRepositorio {
  registrar(datos: DatosRegistro): Promise<void>;
  iniciarSesion(credenciales: Credenciales): Promise<SesionIniciada>;
  usuarioActual(): Promise<Usuario>;
  areaDe(rol: Rol): Promise<AreaDeRol>;
}

export interface AlmacenSesion {
  leer(): string | null;
  guardar(token: string): void;
  borrar(): void;
}
