import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import type { INestApplicationContext } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { EmailAlreadyExistsError } from '../src/modules/auth/application/errors/email-already-exists.error';
import { User } from '../src/modules/auth/domain/entities/user.entity';
import { UserRole } from '../src/modules/auth/domain/enums/user-role.enum';
import { CryptoIdGenerator } from '../src/modules/auth/infrastructure/identifiers/crypto-id-generator';
import { TypeOrmUserRepository } from '../src/modules/auth/infrastructure/persistence/typeorm-user.repository';
import { UserOrmEntity } from '../src/modules/auth/infrastructure/persistence/user.orm-entity';
import { BcryptPasswordHasher } from '../src/modules/auth/infrastructure/security/bcrypt-password-hasher';
import { createDatabaseConfig } from '../src/shared/infrastructure/database/database.config';

const MIN_PASSWORD_LENGTH = 8;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createDatabaseConfig(configService),
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
})
class SeedAdminModule {}

function getRequiredTrimmedValue(
  configService: ConfigService,
  key: string,
): string {
  const value = configService.get<string>(key)?.trim();

  if (!value) {
    throw new Error(`${key} es obligatorio y no puede estar vacío.`);
  }

  return value;
}

function getRequiredPassword(configService: ConfigService): string {
  const password = configService.get<string>('ADMIN_PASSWORD');

  if (!password) {
    throw new Error('ADMIN_PASSWORD es obligatorio y no puede estar vacío.');
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `ADMIN_PASSWORD debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    );
  }

  return password;
}

async function seedAdmin(): Promise<void> {
  let app: INestApplicationContext | undefined;

  try {
    app = await NestFactory.createApplicationContext(SeedAdminModule, {
      logger: ['error', 'warn'],
    });

    const configService = app.get<ConfigService>(ConfigService);
    const repository = app.get<Repository<UserOrmEntity>>(
      getRepositoryToken(UserOrmEntity),
    );
    const userRepository = new TypeOrmUserRepository(repository);

    const nombreCompleto = getRequiredTrimmedValue(
      configService,
      'ADMIN_NOMBRE_COMPLETO',
    );
    const correo = getRequiredTrimmedValue(configService, 'ADMIN_CORREO')
      .toLowerCase();
    const telefono = getRequiredTrimmedValue(
      configService,
      'ADMIN_TELEFONO',
    );
    const password = getRequiredPassword(configService);

    const existingUser = await userRepository.findByEmail(correo);

    if (existingUser) {
      console.log(
        `Ya existe un usuario con el correo ${correo}. No se creó ni modificó ningún usuario.`,
      );
      return;
    }

    const passwordHasher = new BcryptPasswordHasher();
    const idGenerator = new CryptoIdGenerator();
    const now = new Date();

    const admin = new User(
      idGenerator.generate(),
      nombreCompleto,
      correo,
      telefono,
      await passwordHasher.hash(password),
      UserRole.ADMINISTRADOR,
      true,
      now,
      now,
    );

    try {
      await userRepository.save(admin);
    } catch (error: unknown) {
      if (error instanceof EmailAlreadyExistsError) {
        console.log(
          `Ya existe un usuario con el correo ${correo}. No se creó ni modificó ningún usuario.`,
        );
        return;
      }

      throw error;
    }

    console.log(`Administrador inicial creado correctamente para ${correo}.`);
  } finally {
    await app?.close();
  }
}

seedAdmin().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`No se pudo sembrar el administrador inicial: ${message}`);
  process.exitCode = 1;
});
