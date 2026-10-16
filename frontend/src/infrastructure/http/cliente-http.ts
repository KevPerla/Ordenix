import { ErrorDeAplicacion, type TipoError } from "@/application/errores";
import type { AlmacenSesion } from "@/application/puertos/autenticacion";

interface SobreExito<T> {
  exito: true;
  datos: T;
}

interface SobreError {
  exito: false;
  error: {
    tipo: TipoError;
    codigo: string;
    mensaje: string;
    detalles?: unknown;
  };
}

type Sobre<T> = SobreExito<T> | SobreError;

type Metodo = "GET" | "POST" | "PATCH" | "DELETE";

const SIN_CONEXION =
  "No hay conexión con el servidor. Revisa tu red e intenta de nuevo.";

function esSobre<T>(dato: unknown): dato is Sobre<T> {
  return typeof dato === "object" && dato !== null && "exito" in dato;
}

function aError(dato: unknown, estado: number): ErrorDeAplicacion {
  if (esSobre(dato) && !dato.exito) {
    const { detalles } = dato.error;
    const mensaje =
      Array.isArray(detalles) && detalles.every((d) => typeof d === "string")
        ? detalles.join(" ")
        : dato.error.mensaje;

    return new ErrorDeAplicacion(mensaje, dato.error.tipo, dato.error.codigo, estado);
  }

  return new ErrorDeAplicacion(
    "El servidor respondió de forma inesperada.",
    "INFRAESTRUCTURA",
    "RESPUESTA_INESPERADA",
    estado,
  );
}

export class ClienteHttp {
  constructor(
    private readonly baseUrl: string,
    private readonly sesion: AlmacenSesion,
  ) {}

  get<T>(ruta: string): Promise<T> {
    return this.enviar<T>("GET", ruta);
  }

  post<T>(ruta: string, cuerpo: unknown): Promise<T> {
    return this.enviar<T>("POST", ruta, cuerpo);
  }

  patch<T>(ruta: string, cuerpo: unknown): Promise<T> {
    return this.enviar<T>("PATCH", ruta, cuerpo);
  }

  delete(ruta: string): Promise<void> {
    return this.enviar<void>("DELETE", ruta);
  }

  private async enviar<T>(
    metodo: Metodo,
    ruta: string,
    cuerpo?: unknown,
  ): Promise<T> {
    const token = this.sesion.leer();
    let respuesta: Response;

    try {
      respuesta = await fetch(`${this.baseUrl}${ruta}`, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
      });
    } catch {
      throw new ErrorDeAplicacion(SIN_CONEXION, "INFRAESTRUCTURA", "SIN_CONEXION");
    }

    if (respuesta.status === 204) {
      return undefined as T;
    }

    const dato: unknown = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
      throw aError(dato, respuesta.status);
    }

    return esSobre<T>(dato) && dato.exito ? dato.datos : (dato as T);
  }
}
