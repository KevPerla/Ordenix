import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createDatabaseConfig } from '../src/shared/infrastructure/database/database.config';

const SCHEMA_PATH = join(__dirname, '..', '..', 'database', 'schema.sql');

interface TablaResumen {
  table_name: string;
  columnas: string;
}

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
  ],
})
class InicializarBdModule {}

async function inicializar(): Promise<void> {
  const sql = readFileSync(SCHEMA_PATH, 'utf8');
  const app = await NestFactory.createApplicationContext(InicializarBdModule, {
    logger: ['error', 'warn'],
  });

  try {
    const dataSource = app.get(DataSource);
    await dataSource.query(sql);

    const tablas = await dataSource.query<TablaResumen[]>(
      `SELECT t.table_name,
              (SELECT count(*)
                 FROM information_schema.columns c
                WHERE c.table_schema = t.table_schema
                  AND c.table_name = t.table_name) AS columnas
         FROM information_schema.tables t
        WHERE t.table_schema = 'public'
          AND t.table_type = 'BASE TABLE'
        ORDER BY t.table_name`,
    );

    console.log('Esquema aplicado.');
    console.log(`Tablas en el esquema public (${tablas.length}):`);
    tablas.forEach((tabla) => {
      console.log(`  ${tabla.table_name} (${tabla.columnas} columnas)`);
    });
  } finally {
    await app.close();
  }
}

inicializar().catch((error: unknown) => {
  const mensaje = error instanceof Error ? error.message : String(error);
  console.error(`Error al inicializar la base de datos: ${mensaje}`);
  process.exitCode = 1;
});
