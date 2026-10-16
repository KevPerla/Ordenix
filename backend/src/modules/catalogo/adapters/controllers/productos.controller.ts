import {
  Body,
  Controller,
  Delete,
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
import { UserRole } from '../../../auth/domain/enums/user-role.enum';
import { Roles } from '../../../auth/adapters/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../auth/adapters/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/adapters/guards/roles.guard';
import { ActualizarProductoUseCase } from '../../application/use-cases/actualizar-producto.use-case';
import { CrearProductoUseCase } from '../../application/use-cases/crear-producto.use-case';
import { EliminarProductoUseCase } from '../../application/use-cases/eliminar-producto.use-case';
import { ListarProductosUseCase } from '../../application/use-cases/listar-productos.use-case';
import { ObtenerProductoUseCase } from '../../application/use-cases/obtener-producto.use-case';
import { ActualizarProductoDto } from '../dto/actualizar-producto.dto';
import { CrearProductoDto } from '../dto/crear-producto.dto';
import { FiltrarProductosDto } from '../dto/filtrar-productos.dto';
import { presentarProducto, type ProductoResponse } from './presentadores';

@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductosController {
  constructor(
    private readonly listar: ListarProductosUseCase,
    private readonly obtener: ObtenerProductoUseCase,
    private readonly crear: CrearProductoUseCase,
    private readonly actualizar: ActualizarProductoUseCase,
    private readonly eliminar: EliminarProductoUseCase,
  ) {}

  @Get()
  @Roles(UserRole.CLIENTE, UserRole.REPARTIDOR, UserRole.ADMINISTRADOR)
  async list(@Query() filtro: FiltrarProductosDto): Promise<ProductoResponse[]> {
    const productos = await this.listar.execute({
      categoriaId: filtro.categoriaId,
      soloDisponibles: filtro.soloDisponibles,
      busqueda: filtro.busqueda?.trim(),
    });

    return productos.map(presentarProducto);
  }

  @Get(':id')
  @Roles(UserRole.CLIENTE, UserRole.REPARTIDOR, UserRole.ADMINISTRADOR)
  async detail(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductoResponse> {
    return presentarProducto(await this.obtener.execute(id));
  }

  @Post()
  @Roles(UserRole.ADMINISTRADOR)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CrearProductoDto): Promise<ProductoResponse> {
    const producto = await this.crear.execute({
      categoriaId: dto.categoriaId,
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion?.trim() || null,
      precio: dto.precio,
      imagenUrl: dto.imagenUrl?.trim() || null,
      stock: dto.stock,
      disponible: dto.disponible ?? true,
    });

    return presentarProducto(producto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMINISTRADOR)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarProductoDto,
  ): Promise<ProductoResponse> {
    const producto = await this.actualizar.execute({
      id,
      categoriaId: dto.categoriaId,
      nombre: dto.nombre?.trim(),
      descripcion:
        dto.descripcion === undefined ? undefined : dto.descripcion.trim() || null,
      precio: dto.precio,
      imagenUrl:
        dto.imagenUrl === undefined ? undefined : dto.imagenUrl.trim() || null,
      stock: dto.stock,
      disponible: dto.disponible,
    });

    return presentarProducto(producto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.eliminar.execute(id);
  }
}
