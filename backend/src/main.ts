import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const DEFAULT_PORT = 3001;
const DEFAULT_FRONTEND_ORIGIN = 'http://localhost:3000';

function parsePort(value: string | undefined): number {
  const port = Number(value?.trim());

  if (!Number.isInteger(port) || port <= 0 || port > 65_535) {
    return DEFAULT_PORT;
  }

  return port;
}

function getFrontendOrigins(value: string | undefined): string[] {
  const origins = (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return origins.length > 0 ? origins : [DEFAULT_FRONTEND_ORIGIN];
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = parsePort(process.env.PORT);
  const frontendOrigins = getFrontendOrigins(process.env.FRONTEND_ORIGIN);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  app.enableCors({
    origin: frontendOrigins,
  });

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
