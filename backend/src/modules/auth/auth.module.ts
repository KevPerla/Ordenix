import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { AuthController } from './adapters/controllers/auth.controller';
import {
  ID_GENERATOR_TOKEN,
  type IdGenerator,
} from './application/ports/id-generator.port';
import {
  PASSWORD_HASHER_TOKEN,
  type PasswordHasher,
} from './application/ports/password-hasher.port';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import type { UserRepository } from './domain/repositories/user.repository.interface';
import { CryptoIdGenerator } from './infrastructure/identifiers/crypto-id-generator';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher';

const USER_REPOSITORY_TOKEN = Symbol('UserRepository');

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY_TOKEN,
      useFactory: (repository: Repository<UserOrmEntity>): UserRepository =>
        new TypeOrmUserRepository(repository),
      inject: [getRepositoryToken(UserOrmEntity)],
    },
    {
      provide: PASSWORD_HASHER_TOKEN,
      useFactory: (): PasswordHasher => new BcryptPasswordHasher(),
    },
    {
      provide: ID_GENERATOR_TOKEN,
      useFactory: (): IdGenerator => new CryptoIdGenerator(),
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        passwordHasher: PasswordHasher,
        idGenerator: IdGenerator,
      ): RegisterUserUseCase =>
        new RegisterUserUseCase(userRepository, passwordHasher, idGenerator),
      inject: [
        USER_REPOSITORY_TOKEN,
        PASSWORD_HASHER_TOKEN,
        ID_GENERATOR_TOKEN,
      ],
    },
  ],
})
export class AuthModule {}
