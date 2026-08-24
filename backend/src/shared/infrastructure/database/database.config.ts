import { readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { Logger } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const DEFAULT_POSTGRES_PORT = 5432;
const BACKEND_ROOT = resolve(__dirname, '..', '..', '..', '..');
const logger = new Logger('DatabaseConfig');

function parsePostgresPort(value: string | undefined): number {
  if (!value?.trim()) {
    return DEFAULT_POSTGRES_PORT;
  }

  const port = Number.parseInt(value, 10);
  return Number.isNaN(port) ? DEFAULT_POSTGRES_PORT : port;
}

function isSslEnabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

function readCertificate(caPath: string): string | null {
  const rutaAbsoluta = isAbsolute(caPath) ? caPath : resolve(BACKEND_ROOT, caPath);

  try {
    return readFileSync(rutaAbsoluta, 'utf8');
  } catch {
    logger.warn(
      `No se pudo leer el certificado de RDS en ${rutaAbsoluta}. La conexion seguira cifrada, pero sin validar el certificado del servidor.`,
    );
    return null;
  }
}

function createSslConfig(
  configService: ConfigService,
): PostgresConnectionOptions['ssl'] {
  if (!isSslEnabled(configService.get<string>('DB_SSL'))) {
    return false;
  }

  const caPath = configService.get<string>('DB_SSL_CA_PATH')?.trim();

  if (!caPath) {
    return { rejectUnauthorized: false };
  }

  const certificado = readCertificate(caPath);

  if (!certificado) {
    return { rejectUnauthorized: false };
  }

  return {
    ca: certificado,
    rejectUnauthorized: true,
  };
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
    synchronize: false,
    ssl: createSslConfig(configService),
    autoLoadEntities: true,
  };
}
