import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

interface HealthResponse {
  estado: 'ok' | 'degradado';
  baseDatos: 'conectada' | 'sin conexion';
  tiempo: string;
}

@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get()
  async check(): Promise<HealthResponse> {
    let baseDatos: HealthResponse['baseDatos'] = 'sin conexion';

    try {
      await this.dataSource.query('SELECT 1');
      baseDatos = 'conectada';
    } catch {
      baseDatos = 'sin conexion';
    }

    return {
      estado: baseDatos === 'conectada' ? 'ok' : 'degradado',
      baseDatos,
      tiempo: new Date().toISOString(),
    };
  }
}
