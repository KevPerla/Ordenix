import * as bcrypt from 'bcrypt';
import type { PasswordHasher } from '../../application/ports/password-hasher.port';

const BCRYPT_SALT_ROUNDS = 12;

export class BcryptPasswordHasher implements PasswordHasher {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }
}
