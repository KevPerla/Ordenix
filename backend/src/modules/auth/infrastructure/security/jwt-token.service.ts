import type { JwtService } from '@nestjs/jwt';
import type {
  AuthTokenPayload,
  TokenService,
} from '../../application/ports/token-service.port';

export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generate(payload: AuthTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
