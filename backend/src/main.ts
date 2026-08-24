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

function getFrontendOrigin(value: string | undefined): string {
  return value?.trim() || DEFAULT_FRONTEND_ORIGIN;
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = parsePort(process.env.PORT);
  const frontendOrigin = getFrontendOrigin(process.env.FRONTEND_ORIGIN);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: frontendOrigin,
  });

  await app.listen(port);
}

void bootstrap();
