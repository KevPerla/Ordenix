import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthModule } from '../auth/auth.module';
import { PedidosController } from './adapters/controllers/pedidos.controller';
import {
  UNIDAD_DE_TRABAJO_TOKEN,
  type UnidadDeTrabajo,
} from './application/ports/unidad-de-trabajo.port';
import { CambiarEstadoPedidoUseCase } from './application/use-cases/cambiar-estado-pedido.use-case';
import { CrearPedidoUseCase } from './application/use-cases/crear-pedido.use-case';
import { ListarPedidosUseCase } from './application/use-cases/listar-pedidos.use-case';
import { ObtenerPedidoUseCase } from './application/use-cases/obtener-pedido.use-case';
import {
  PEDIDO_REPOSITORY_TOKEN,
  type PedidoRepository,
} from './application/ports/pedido.repository.port';
import { TypeOrmPedidoRepository } from './infrastructure/persistence/typeorm-pedido.repository';
import { TypeOrmUnidadDeTrabajo } from './infrastructure/persistence/typeorm-unidad-de-trabajo';

@Module({
  imports: [AuthModule],
  controllers: [PedidosController],
  providers: [
    {
      provide: UNIDAD_DE_TRABAJO_TOKEN,
      useFactory: (dataSource: DataSource): UnidadDeTrabajo =>
        new TypeOrmUnidadDeTrabajo(dataSource),
      inject: [DataSource],
    },
    {
      provide: PEDIDO_REPOSITORY_TOKEN,
      useFactory: (dataSource: DataSource): PedidoRepository =>
        new TypeOrmPedidoRepository(dataSource),
      inject: [DataSource],
    },
    {
      provide: CrearPedidoUseCase,
      useFactory: (unidadDeTrabajo: UnidadDeTrabajo) =>
        new CrearPedidoUseCase(unidadDeTrabajo),
      inject: [UNIDAD_DE_TRABAJO_TOKEN],
    },
    {
      provide: ListarPedidosUseCase,
      useFactory: (repositorio: PedidoRepository) =>
        new ListarPedidosUseCase(repositorio),
      inject: [PEDIDO_REPOSITORY_TOKEN],
    },
    {
      provide: ObtenerPedidoUseCase,
      useFactory: (repositorio: PedidoRepository) =>
        new ObtenerPedidoUseCase(repositorio),
      inject: [PEDIDO_REPOSITORY_TOKEN],
    },
    {
      provide: CambiarEstadoPedidoUseCase,
      useFactory: (repositorio: PedidoRepository) =>
        new CambiarEstadoPedidoUseCase(repositorio),
      inject: [PEDIDO_REPOSITORY_TOKEN],
    },
  ],
})
export class PedidosModule {}
