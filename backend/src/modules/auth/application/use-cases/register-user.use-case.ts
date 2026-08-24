import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';
import { EmailAlreadyExistsError } from '../errors/email-already-exists.error';
import type { IdGenerator } from '../ports/id-generator.port';
import type { PasswordHasher } from '../ports/password-hasher.port';

export interface RegisterUserInput {
  nombreCompleto: string;
  correo: string;
  telefono: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly idGenerator: IdGenerator,
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const normalizedEmail = input.correo.trim().toLowerCase();
    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const id = this.idGenerator.generate();
    const now = new Date();

    const user = new User(
      id,
      input.nombreCompleto,
      normalizedEmail,
      input.telefono,
      passwordHash,
      UserRole.CLIENTE,
      true,
      now,
      now,
    );

    return this.userRepository.save(user);
  }
}
