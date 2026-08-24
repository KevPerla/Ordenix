import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { AuthTokenPayload } from '../../application/ports/token-service.port';
import type { AuthenticatedRequest } from '../types/authenticated-request.interface';

export const CurrentAuth = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthTokenPayload => {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();

    if (!request.auth) {
      throw new UnauthorizedException('No autorizado');
    }

    return request.auth;
  },
);
