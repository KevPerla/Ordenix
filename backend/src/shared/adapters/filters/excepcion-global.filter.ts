import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ErrorDominio,
  type CategoriaError,
} from '../../domain/errors/error-dominio';
import type { SobreError } from '../http/envelope';

const ESTADO_POR_CATEGORIA: Record<CategoriaError, number> = {
  DOMINIO: HttpStatus.BAD_REQUEST,
  CONFLICTO: HttpStatus.CONFLICT,
  NO_ENCONTRADO: HttpStatus.NOT_FOUND,
  PROHIBIDO: HttpStatus.FORBIDDEN,
};

const CODIGO_POR_ESTADO: Record<number, string> = {
  400: 'PETICION_INVALIDA',
  401: 'NO_AUTENTICADO',
  403: 'ACCESO_DENEGADO',
  404: 'NO_ENCONTRADO',
  409: 'CONFLICTO',
  422: 'ENTIDAD_NO_PROCESABLE',
};

function tipoSegunEstado(estado: number): SobreError['error']['tipo'] {
  if (estado === HttpStatus.UNAUTHORIZED || estado === HttpStatus.FORBIDDEN) {
    return 'SEGURIDAD';
  }

  if (estado >= HttpStatus.INTERNAL_SERVER_ERROR) {
    return 'INFRAESTRUCTURA';
  }

  return 'DOMINIO';
}

function extraerDeHttpException(excepcion: HttpException): {
  mensaje: string;
  detalles?: unknown;
} {
  const respuesta = excepcion.getResponse();

  if (typeof respuesta === 'string') {
    return { mensaje: respuesta };
  }

  const cuerpo = respuesta as { message?: unknown; error?: unknown };

  if (Array.isArray(cuerpo.message)) {
    return {
      mensaje: 'La peticion no cumple con las validaciones.',
      detalles: cuerpo.message,
    };
  }

  if (typeof cuerpo.message === 'string') {
    return { mensaje: cuerpo.message };
  }

  return { mensaje: excepcion.message };
}

@Catch()
export class ExcepcionGlobalFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExcepcionGlobal');

  catch(excepcion: unknown, host: ArgumentsHost): void {
    const contexto = host.switchToHttp();
    const respuesta = contexto.getResponse<Response>();
    const peticion = contexto.getRequest<Request>();

    const { estado, tipo, codigo, mensaje, detalles } =
      this.describir(excepcion);

    if (estado >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${peticion.method} ${peticion.url} -> ${estado}`,
        excepcion instanceof Error ? excepcion.stack : String(excepcion),
      );
    }

    const sobre: SobreError = {
      exito: false,
      error: { tipo, codigo, mensaje, ...(detalles ? { detalles } : {}) },
      meta: {
        marcaTiempo: new Date().toISOString(),
        ruta: peticion.url,
      },
    };

    respuesta.status(estado).json(sobre);
  }

  private describir(excepcion: unknown): {
    estado: number;
    tipo: SobreError['error']['tipo'];
    codigo: string;
    mensaje: string;
    detalles?: unknown;
  } {
    if (excepcion instanceof ErrorDominio) {
      const estado = ESTADO_POR_CATEGORIA[excepcion.categoria];

      return {
        estado,
        tipo: tipoSegunEstado(estado),
        codigo: excepcion.codigo,
        mensaje: excepcion.message,
        detalles: excepcion.detalles,
      };
    }

    if (excepcion instanceof HttpException) {
      const estado = excepcion.getStatus();
      const { mensaje, detalles } = extraerDeHttpException(excepcion);

      return {
        estado,
        tipo: tipoSegunEstado(estado),
        codigo: CODIGO_POR_ESTADO[estado] ?? 'ERROR_HTTP',
        mensaje,
        detalles,
      };
    }

    return {
      estado: HttpStatus.INTERNAL_SERVER_ERROR,
      tipo: 'INFRAESTRUCTURA',
      codigo: 'ERROR_INTERNO',
      mensaje: 'Ocurrio un error inesperado en el servidor.',
    };
  }
}
