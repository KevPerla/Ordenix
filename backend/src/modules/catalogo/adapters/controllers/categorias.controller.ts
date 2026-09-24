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
import { ActualizarCategoriaUseCase } from '../../application/use-cases/actualizar-categoria.use-case';
import { CrearCategoriaUseCase } from '../../application/use-cases/crear-categoria.use-case';
import { EliminarCategoriaUseCase } from '../../application/use-cases/eliminar-categoria.use-case';
import { ListarCategoriasUseCase } from '../../application/use-cases/listar-categorias.use-case';
import { ActualizarCategoriaDto } from '../dto/actualizar-categoria.dto';
import { CrearCategoriaDto } from '../dto/crear-categoria.dto';
import { presentarCategoria, type CategoriaResponse } from './presentadores';

@Controller('categorias')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriasController {
  constructor(
    private readonly listar: ListarCategoriasUseCase,
    private readonly crear: CrearCategoriaUseCase,
    private readonly actualizar: ActualizarCategoriaUseCase,
    private readonly eliminar: EliminarCategoriaUseCase,
  ) {}

  @Get()
  @Roles(UserRole.CLIENTE, UserRole.REPARTIDOR, UserRole.ADMINISTRADOR)
  async list(
    @Query('incluirInactivas') incluirInactivas?: string,
  ): Promise<CategoriaResponse[]> {
    const categorias = await this.listar.execute(incluirInactivas !== 'true');
    return categorias.map(presentarCategoria);
  }

  @Post()
  @Roles(UserRole.ADMINISTRADOR)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CrearCategoriaDto): Promise<CategoriaResponse> {
    const categoria = await this.crear.execute({
      nombre: dto.nombre.trim(),
      descripcion: dto.descripcion?.trim() || null,
    });

    return presentarCategoria(categoria);
  }

  @Patch(':id')
  @Roles(UserRole.ADMINISTRADOR)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ActualizarCategoriaDto,
  ): Promise<CategoriaResponse> {
    const categoria = await this.actualizar.execute({
      id,
      nombre: dto.nombre?.trim(),
      descripcion:
        dto.descripcion === undefined ? undefined : dto.descripcion.trim() || null,
      activo: dto.activo,
    });

    return presentarCategoria(categoria);
  }

  @Delete(':id')
  @Roles(UserRole.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.eliminar.execute(id);
  }
}
