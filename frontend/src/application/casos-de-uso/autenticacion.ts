import type {
  AreaDeRol,
  Credenciales,
  DatosRegistro,
  Usuario,
} from "@/domain/usuario";
import { ErrorDeAplicacion } from "../errores";
import type {
  AlmacenSesion,
  AutenticacionRepositorio,
} from "../puertos/autenticacion";

export class CasosAutenticacion {
  constructor(
    private readonly repositorio: AutenticacionRepositorio,
    private readonly sesion: AlmacenSesion,
  ) {}

  async iniciarSesion(credenciales: Credenciales): Promise<Usuario> {
    const { token, usuario } = await this.repositorio.iniciarSesion({
      correo: credenciales.correo.trim(),
      password: credenciales.password,
    });

    this.sesion.guardar(token);
    return usuario;
  }

  async registrarse(datos: DatosRegistro): Promise<Usuario> {
    await this.repositorio.registrar({
      nombreCompleto: datos.nombreCompleto.trim(),
      correo: datos.correo.trim(),
      telefono: datos.telefono.trim(),
      password: datos.password,
    });

    return this.iniciarSesion(datos);
  }

  async restaurarSesion(): Promise<Usuario | null> {
    if (!this.sesion.leer()) {
      return null;
    }

    try {
      return await this.repositorio.usuarioActual();
    } catch (error: unknown) {
      if (error instanceof ErrorDeAplicacion && error.esSesionInvalida) {
        this.sesion.borrar();
        return null;
      }

      throw error;
    }
  }

  cerrarSesion(): void {
    this.sesion.borrar();
  }

  verificarArea(usuario: Usuario): Promise<AreaDeRol> {
    return this.repositorio.areaDe(usuario.rol);
  }
}
