import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createDatabaseConfig } from '../src/shared/infrastructure/database/database.config';

const CARPETA_MIGRACIONES = resolve(__dirname, '..', '..', 'database', 'migrations');

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createDatabaseConfig(configService),
    }),
  ],
})
class MigracionModule {}

async function migrar(): Promise<void> {
  const app = await NestFactory.createApplicationContext(MigracionModule, {
    logger: ['error', 'warn'],
  });

  try {
    const dataSource = app.get(DataSource);

    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        archivo     VARCHAR(255) PRIMARY KEY,
        aplicada_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    const aplicadas = await dataSource.query<{ archivo: string }[]>(
      'SELECT archivo FROM schema_migrations',
    );
    const yaAplicadas = new Set(aplicadas.map((fila) => fila.archivo));

    const archivos = readdirSync(CARPETA_MIGRACIONES)
      .filter((nombre) => nombre.endsWith('.sql'))
      .sort();

    let ejecutadas = 0;

    for (const archivo of archivos) {
      if (yaAplicadas.has(archivo)) {
        console.log(`omitida  ${archivo} (ya aplicada)`);
        continue;
      }

      const sql = readFileSync(resolve(CARPETA_MIGRACIONES, archivo), 'utf8');
      await dataSource.query(sql);
      await dataSource.query(
        'INSERT INTO schema_migrations (archivo) VALUES ($1)',
        [archivo],
      );

      console.log(`aplicada ${archivo}`);
      ejecutadas += 1;
    }

    console.log(
      ejecutadas === 0
        ? 'La base ya estaba al dia.'
        : `${ejecutadas} migracion(es) aplicadas.`,
    );
  } finally {
    await app.close();
  }
}

migrar().catch((error: unknown) => {
  const mensaje = error instanceof Error ? error.message : String(error);
  console.error(`No se pudieron aplicar las migraciones: ${mensaje}`);
  process.exitCode = 1;
});
