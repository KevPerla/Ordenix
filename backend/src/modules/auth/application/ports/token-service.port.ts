import type { UserRole } from '../../domain/enums/user-role.enum';

export const TOKEN_SERVICE_TOKEN = Symbol('TokenService');

export interface AuthTokenPayload {
  sub: string;
  rol: UserRole;
}

export interface TokenService {
  generate(payload: AuthTokenPayload): Promise<string>;
}
