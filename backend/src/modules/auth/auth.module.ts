import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  JwtModule,
  JwtService,
  type JwtModuleOptions,
} from '@nestjs/jwt';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { AuthController } from './adapters/controllers/auth.controller';
import { JwtAuthGuard } from './adapters/guards/jwt-auth.guard';
import { RolesGuard } from './adapters/guards/roles.guard';
import {
  ID_GENERATOR_TOKEN,
  type IdGenerator,
} from './application/ports/id-generator.port';
import {
  PASSWORD_HASHER_TOKEN,
  type PasswordHasher,
} from './application/ports/password-hasher.port';
import {
  TOKEN_SERVICE_TOKEN,
  type TokenService,
} from './application/ports/token-service.port';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import type { UserRepository } from './domain/repositories/user.repository.interface';
import { CryptoIdGenerator } from './infrastructure/identifiers/crypto-id-generator';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher';
import { JwtTokenService } from './infrastructure/security/jwt-token.service';

const USER_REPOSITORY_TOKEN = Symbol('UserRepository');
const DEFAULT_JWT_EXPIRES_IN = '8h';
const JWT_DURATION_PATTERN = /^(\d+)([smhd])$/i;
const JWT_DURATION_SECONDS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
};

function getJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET')?.trim();

  if (!secret) {
    throw new Error('JWT_SECRET es obligatorio y no puede estar vacío.');
  }

  return secret;
}

function parseJwtExpiresIn(value: string | undefined): number {
  const normalizedValue = value?.trim() || DEFAULT_JWT_EXPIRES_IN;
  const numericValue = Number(normalizedValue);

  if (Number.isFinite(numericValue) && numericValue > 0) {
    return numericValue;
  }

  const match = JWT_DURATION_PATTERN.exec(normalizedValue);

  if (!match) {
    throw new Error(
      'JWT_EXPIRES_IN debe ser un número de segundos o usar s, m, h o d.',
    );
  }

  const amount = Number(match[1]);
  const multiplier = JWT_DURATION_SECONDS[match[2].toLowerCase()];
  const seconds = amount * multiplier;

  if (!Number.isSafeInteger(seconds) || seconds <= 0) {
    throw new Error('JWT_EXPIRES_IN debe representar una duración positiva.');
  }

  return seconds;
}

function createJwtConfig(configService: ConfigService): JwtModuleOptions {
  return {
    secret: getJwtSecret(configService),
    signOptions: {
      expiresIn: parseJwtExpiresIn(
        configService.get<string>('JWT_EXPIRES_IN'),
      ),
    },
  };
}

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions =>
        createJwtConfig(configService),
    }),
  ],
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
      provide: TOKEN_SERVICE_TOKEN,
      useFactory: (jwtService: JwtService): TokenService =>
        new JwtTokenService(jwtService),
      inject: [JwtService],
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
    {
      provide: LoginUserUseCase,
      useFactory: (
        userRepository: UserRepository,
        passwordHasher: PasswordHasher,
        tokenService: TokenService,
      ): LoginUserUseCase =>
        new LoginUserUseCase(userRepository, passwordHasher, tokenService),
      inject: [
        USER_REPOSITORY_TOKEN,
        PASSWORD_HASHER_TOKEN,
        TOKEN_SERVICE_TOKEN,
      ],
    },
    {
      provide: GetCurrentUserUseCase,
      useFactory: (userRepository: UserRepository): GetCurrentUserUseCase =>
        new GetCurrentUserUseCase(userRepository),
      inject: [USER_REPOSITORY_TOKEN],
    },
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
