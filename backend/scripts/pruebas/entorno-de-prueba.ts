import { randomUUID } from 'node:crypto';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { createDatabaseConfig } from '../../src/shared/infrastructure/database/database.config';

const CATEGORIA_DE_PRUEBAS = 'Pruebas de estres';

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
class PruebasModule {}

export interface Respuesta<T = unknown> {
  http: number;
  exito: boolean;
  datos: T;
  error?: { codigo: string; mensaje: string };
}

export interface ProductoCreado {
  id: string;
  nombre: string;
  stock: number;
}

export class EntornoDePrueba {
  private constructor(
    readonly db: DataSource,
    private readonly apiUrl: string,
    private readonly tokenAdmin: string,
    private readonly categoriaId: string,
  ) {}

  static async ejecutar(
    prueba: (entorno: EntornoDePrueba) => Promise<boolean>,
  ): Promise<void> {
    const app = await NestFactory.createApplicationContext(PruebasModule, {
      logger: ['error', 'warn'],
    });

    try {
      const config = app.get(ConfigService);
      const apiUrl =
        config.get<string>('PRUEBAS_API_URL') ??
        `http://localhost:${config.get<string>('PORT') ?? '3001'}`;

      const tokenAdmin = await iniciarSesion(
        apiUrl,
        requerido(config, 'ADMIN_CORREO'),
        requerido(config, 'ADMIN_PASSWORD'),
      );

      const categoriaId = await asegurarCategoria(apiUrl, tokenAdmin);
      const entorno = new EntornoDePrueba(
        app.get(DataSource),
        apiUrl,
        tokenAdmin,
        categoriaId,
      );

      try {
        process.exitCode = (await prueba(entorno)) ? 0 : 1;
      } finally {
        await llamar(apiUrl, 'PATCH', `/categorias/${categoriaId}`, tokenAdmin, {
          activo: false,
        });
      }
    } finally {
      await app.close();
    }
  }

  async crearProducto(nombre: string, stock: number): Promise<ProductoCreado> {
    const respuesta = await llamar<ProductoCreado>(
      this.apiUrl,
      'POST',
      '/productos',
      this.tokenAdmin,
      { categoriaId: this.categoriaId, nombre, precio: 1.5, stock },
    );

    return exigir(respuesta, `crear el producto ${nombre}`);
  }

  async retirarProducto(id: string): Promise<void> {
    await llamar(this.apiUrl, 'PATCH', `/productos/${id}`, this.tokenAdmin, {
      disponible: false,
    });
  }

  async nuevoCliente(etiqueta: string): Promise<string> {
    const correo = `prueba.${etiqueta}.${Date.now()}@ordenix.test`;
    const password = randomUUID();

    exigir(
      await llamar(this.apiUrl, 'POST', '/auth/register', null, {
        nombreCompleto: `Cliente de prueba ${etiqueta.toUpperCase()}`,
        correo,
        telefono: '7000-0000',
        password,
      }),
      `registrar al cliente ${etiqueta}`,
    );

    return iniciarSesion(this.apiUrl, correo, password);
  }

  comprar(
    token: string,
    notas: string,
    lineas: { productoId: string; cantidad: number }[],
  ): Promise<Respuesta> {
    return llamar(this.apiUrl, 'POST', '/pedidos', token, {
      direccionCompleta: 'Colonia Escalon, Calle Principal 5, San Salvador',
      notas,
      lineas,
    });
  }
}

export function marca(): string {
  return new Date().toISOString().slice(11, 19).replaceAll(':', '');
}

export function linea(texto = ''): void {
  console.log(texto);
}

async function llamar<T = unknown>(
  apiUrl: string,
  metodo: string,
  ruta: string,
  token: string | null,
  cuerpo?: unknown,
): Promise<Respuesta<T>> {
  const respuesta = await fetch(`${apiUrl}${ruta}`, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  });

  const sobre = (await respuesta.json().catch(() => ({}))) as {
    exito?: boolean;
    datos?: T;
    error?: { codigo: string; mensaje: string };
  };

  return {
    http: respuesta.status,
    exito: sobre.exito === true,
    datos: sobre.datos as T,
    error: sobre.error,
  };
}

function exigir<T>(respuesta: Respuesta<T>, accion: string): T {
  if (!respuesta.exito) {
    throw new Error(
      `No se pudo ${accion}: HTTP ${respuesta.http} ${respuesta.error?.mensaje ?? ''}`,
    );
  }

  return respuesta.datos;
}

async function iniciarSesion(
  apiUrl: string,
  correo: string,
  password: string,
): Promise<string> {
  const respuesta = await llamar<{ accessToken: string }>(
    apiUrl,
    'POST',
    '/auth/login',
    null,
    { correo, password },
  );

  return exigir(respuesta, `iniciar sesion como ${correo}`).accessToken;
}

async function asegurarCategoria(
  apiUrl: string,
  token: string,
): Promise<string> {
  const existentes = exigir(
    await llamar<{ id: string; nombre: string }[]>(
      apiUrl,
      'GET',
      '/categorias?incluirInactivas=true',
      token,
    ),
    'listar las categorias',
  );

  const encontrada = existentes.find(
    (categoria) => categoria.nombre === CATEGORIA_DE_PRUEBAS,
  );

  if (encontrada) {
    return encontrada.id;
  }

  return exigir(
    await llamar<{ id: string }>(apiUrl, 'POST', '/categorias', token, {
      nombre: CATEGORIA_DE_PRUEBAS,
    }),
    'crear la categoria de pruebas',
  ).id;
}

function requerido(config: ConfigService, clave: string): string {
  const valor = config.get<string>(clave)?.trim();

  if (!valor) {
    throw new Error(`${clave} es obligatorio para ejecutar las pruebas.`);
  }

  return valor;
}
