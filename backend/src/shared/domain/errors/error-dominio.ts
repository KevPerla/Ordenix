export type CategoriaError =
  | 'DOMINIO'
  | 'CONFLICTO'
  | 'NO_ENCONTRADO'
  | 'PROHIBIDO';

export abstract class ErrorDominio extends Error {
  abstract readonly codigo: string;
  abstract readonly categoria: CategoriaError;

  readonly detalles?: Record<string, unknown>;

  constructor(mensaje: string, detalles?: Record<string, unknown>) {
    super(mensaje);
    this.name = new.target.name;
    this.detalles = detalles;
  }
}

export abstract class ErrorReglaNegocio extends ErrorDominio {
  readonly categoria = 'DOMINIO' as const;
}

export abstract class ErrorConflicto extends ErrorDominio {
  readonly categoria = 'CONFLICTO' as const;
}

export abstract class ErrorNoEncontrado extends ErrorDominio {
  readonly categoria = 'NO_ENCONTRADO' as const;
}

export abstract class ErrorProhibido extends ErrorDominio {
  readonly categoria = 'PROHIBIDO' as const;
}
