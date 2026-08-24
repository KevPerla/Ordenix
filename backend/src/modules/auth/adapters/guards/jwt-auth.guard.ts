import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  TOKEN_SERVICE_TOKEN,
  type TokenService,
} from '../../application/ports/token-service.port';
import type { AuthenticatedRequest } from '../types/authenticated-request.interface';

function extractBearerToken(
  authorizationHeader: string | string[] | undefined,
): string | null {
  if (typeof authorizationHeader !== 'string') {
    return null;
  }

  const match = /^Bearer[ \t]+(\S+)$/i.exec(authorizationHeader.trim());
  return match?.[1] ?? null;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('No autorizado');
    }

    const auth = await this.tokenService.verify(token);

    if (!auth) {
      throw new UnauthorizedException('No autorizado');
    }

    request.auth = auth;
    return true;
  }
}
