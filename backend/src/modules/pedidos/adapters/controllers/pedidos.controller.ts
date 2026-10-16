import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentAuth } from '../../../auth/adapters/decorators/current-auth.decorator';
import { Roles } from '../../../auth/adapters/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../auth/adapters/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/adapters/guards/roles.guard';
import type { AuthTokenPayload } from '../../../auth/application/ports/token-service.port';
import { UserRole } from '../../../auth/domain/enums/user-role.enum';
import { CambiarEstadoPedidoUseCase } from '../../application/use-cases/cambiar-estado-pedido.use-case';
import {
  CrearPedidoUseCase,
  type PedidoCreado,
} from '../../application/use-cases/crear-pedido.use-case';
import { ListarPedidosUseCase } from '../../application/use-cases/listar-pedidos.use-case';
import { ObtenerPedidoUseCase } from '../../application/use-cases/obtener-pedido.use-case';
import type { FiltroPedidos } from '../../application/ports/pedido.repository.port';
import { CambiarEstadoDto } from '../dto/cambiar-estado.dto';
import { CrearPedidoDto } from '../dto/crear-pedido.dto';
import { FiltrarPedidosDto } from '../dto/filtrar-pedidos.dto';
import { presentarPedido, type PedidoResponse } from './presentador-pedido';

@Controller('pedidos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PedidosController {
  constructor(
    private readonly crear: CrearPedidoUseCase,
    private readonly listar: ListarPedidosUseCase,
    private readonly obtener: ObtenerPedidoUseCase,
    private readonly cambiarEstado: CambiarEstadoPedidoUseCase,
  ) {}

  @Post()
  @Roles(UserRole.CLIENTE)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CrearPedidoDto,
    @CurrentAuth() auth: AuthTokenPayload,
  ): Promise<PedidoCreado> {
    return this.crear.execute({
      clienteId: auth.sub,
      direccionCompleta: dto.direccionCompleta.trim(),
      referencia: dto.referencia?.trim() || null,
      notas: dto.notas?.trim() || null,
      lineas: dto.lineas.map((linea) => ({
        productoId: linea.productoId,
        cantidad: linea.cantidad,
      })),
    });
  }

  @Get()
  @Roles(UserRole.CLIENTE, UserRole.REPARTIDOR, UserRole.ADMINISTRADOR)
  async list(
    @Query() filtro: FiltrarPedidosDto,
    @CurrentAuth() auth: AuthTokenPayload,
  ): Promise<PedidoResponse[]> {
    const condiciones: FiltroPedidos = { estado: filtro.estado };

    if (auth.rol === UserRole.CLIENTE) {
      condiciones.clienteId = auth.sub;
    }

    if (auth.rol === UserRole.REPARTIDOR) {
      condiciones.visiblesParaRepartidor = auth.sub;
    }

    const pedidos = await this.listar.execute(condiciones);

    return pedidos.map(presentarPedido);
  }

  @Get(':id')
  @Roles(UserRole.CLIENTE, UserRole.REPARTIDOR, UserRole.ADMINISTRADOR)
  async detail(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentAuth() auth: AuthTokenPayload,
  ): Promise<PedidoResponse> {
    const pedido = await this.obtener.execute({
      id,
      solicitanteId: auth.sub,
      esAdministrador: auth.rol === UserRole.ADMINISTRADOR,
      esRepartidor: auth.rol === UserRole.REPARTIDOR,
    });

    return presentarPedido(pedido);
  }

  @Patch(':id/estado')
  @Roles(UserRole.REPARTIDOR, UserRole.ADMINISTRADOR)
  async changeState(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CambiarEstadoDto,
    @CurrentAuth() auth: AuthTokenPayload,
  ): Promise<PedidoResponse> {
    const pedido = await this.cambiarEstado.execute({
      pedidoId: id,
      destino: dto.estado,
      usuarioId: auth.sub,
      esRepartidor: auth.rol === UserRole.REPARTIDOR,
    });

    return presentarPedido(pedido);
  }
}
