import type { User } from '../../domain/entities/user.entity';
import type { UserRepository } from '../ports/user.repository.port';
import { CurrentUserUnavailableError } from '../errors/current-user-unavailable.error';

export interface GetCurrentUserInput {
  userId: string;
}

export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetCurrentUserInput): Promise<User> {
    const user = await this.userRepository.findById(input.userId);

    if (!user || !user.activo) {
      throw new CurrentUserUnavailableError();
    }

    return user;
  }
}
