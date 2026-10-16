export interface SobreExito<T> {
  exito: true;
  datos: T;
  meta: {
    marcaTiempo: string;
    ruta: string;
  };
}

export interface SobreError {
  exito: false;
  error: {
    tipo: 'DOMINIO' | 'SEGURIDAD' | 'INFRAESTRUCTURA';
    codigo: string;
    mensaje: string;
    detalles?: unknown;
  };
  meta: {
    marcaTiempo: string;
    ruta: string;
  };
}

export type Sobre<T> = SobreExito<T> | SobreError;
