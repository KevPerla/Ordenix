import type {
  AutenticacionRepositorio,
  SesionIniciada,
} from "@/application/puertos/autenticacion";
import type {
  AreaDeRol,
  Credenciales,
  DatosRegistro,
  Rol,
  Usuario,
} from "@/domain/usuario";
import type { ClienteHttp } from "./cliente-http";

interface UsuarioApi {
  id: string;
  nombreCompleto: string;
  correo: string;
  rol: Rol;
}

const AREA_POR_ROL: Record<Rol, string> = {
  CLIENTE: "/areas/cliente",
  ADMINISTRADOR: "/areas/administracion",
  REPARTIDOR: "/areas/reparto",
};

function aUsuario(usuario: UsuarioApi): Usuario {
  return {
    id: usuario.id,
    nombre: usuario.nombreCompleto,
    email: usuario.correo,
    rol: usuario.rol,
  };
}

export class AutenticacionHttp implements AutenticacionRepositorio {
  constructor(private readonly http: ClienteHttp) {}

  async registrar(datos: DatosRegistro): Promise<void> {
    await this.http.post("/auth/register", datos);
  }

  async iniciarSesion(credenciales: Credenciales): Promise<SesionIniciada> {
    const respuesta = await this.http.post<{
      accessToken: string;
      user: UsuarioApi;
    }>("/auth/login", credenciales);

    return { token: respuesta.accessToken, usuario: aUsuario(respuesta.user) };
  }

  async usuarioActual(): Promise<Usuario> {
    return aUsuario(await this.http.get<UsuarioApi>("/auth/me"));
  }

  areaDe(rol: Rol): Promise<AreaDeRol> {
    return this.http.get<AreaDeRol>(AREA_POR_ROL[rol]);
  }
}
