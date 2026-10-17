export type TipoError = "DOMINIO" | "SEGURIDAD" | "INFRAESTRUCTURA" | "VALIDACION";

export class ErrorDeAplicacion extends Error {
  constructor(
    message: string,
    public readonly tipo: TipoError,
    public readonly codigo: string,
    public readonly estado = 0,
  ) {
    super(message);
    this.name = "ErrorDeAplicacion";
  }

  get esSesionInvalida(): boolean {
    return this.estado === 401;
  }
}

export function errorDeValidacion(mensaje: string): ErrorDeAplicacion {
  return new ErrorDeAplicacion(mensaje, "VALIDACION", "VALIDACION", 400);
}

export function mensajeDeError(error: unknown, respaldo: string): string {
  return error instanceof ErrorDeAplicacion ? error.message : respaldo;
}
