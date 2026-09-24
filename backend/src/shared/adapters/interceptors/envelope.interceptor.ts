import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { SobreExito } from '../http/envelope';

@Injectable()
export class EnvelopeInterceptor<T>
  implements NestInterceptor<T, SobreExito<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<SobreExito<T>> {
    const peticion = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((datos) => ({
        exito: true as const,
        datos,
        meta: {
          marcaTiempo: new Date().toISOString(),
          ruta: peticion.url,
        },
      })),
    );
  }
}
