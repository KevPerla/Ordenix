import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const DEFAULT_POSTGRES_PORT = 5432;

function parsePostgresPort(value: string | undefined): number {
  if (!value?.trim()) {
    return DEFAULT_POSTGRES_PORT;
  }

  const port = Number.parseInt(value, 10);
  return Number.isNaN(port) ? DEFAULT_POSTGRES_PORT : port;
}

function isSynchronizationEnabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

export function createDatabaseConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: parsePostgresPort(configService.get<string>('DB_PORT')),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    synchronize: isSynchronizationEnabled(
      configService.get<string>('DB_SYNCHRONIZE'),
    ),
    autoLoadEntities: true,
  };
}
