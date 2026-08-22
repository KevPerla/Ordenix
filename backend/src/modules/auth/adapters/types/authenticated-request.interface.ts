import type { AuthTokenPayload } from '../../application/ports/token-service.port';

export interface AuthenticatedRequest {
  headers: {
    authorization?: string | string[];
  };
  auth?: AuthTokenPayload;
}
