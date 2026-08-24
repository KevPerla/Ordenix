import type { JwtService } from '@nestjs/jwt';
import type {
  AuthTokenPayload,
  TokenService,
} from '../../application/ports/token-service.port';
import { UserRole } from '../../domain/enums/user-role.enum';

function isUserRole(value: unknown): value is UserRole {
  return Object.values(UserRole).some((role) => role === value);
}

export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generate(payload: AuthTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verify(token: string): Promise<AuthTokenPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<Record<string, unknown>>(
        token,
      );

      if (
        typeof payload.sub !== 'string' ||
        payload.sub.trim().length === 0 ||
        !isUserRole(payload.rol)
      ) {
        return null;
      }

      return {
        sub: payload.sub,
        rol: payload.rol,
      };
    } catch {
      return null;
    }
  }
}
