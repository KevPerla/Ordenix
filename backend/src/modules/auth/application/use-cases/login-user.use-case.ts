import type { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import type { PasswordHasher } from '../ports/password-hasher.port';
import type { TokenService } from '../ports/token-service.port';

export interface LoginUserInput {
  correo: string;
  password: string;
}

export interface LoginUserResult {
  accessToken: string;
  user: User;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginUserResult> {
    const normalizedEmail = input.correo.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user || !user.activo) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.tokenService.generate({
      sub: user.id,
      rol: user.rol,
    });

    return { accessToken, user };
  }
}
