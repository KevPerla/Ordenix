import { Controller, Get, UseGuards } from '@nestjs/common';
import type { AuthTokenPayload } from '../../application/ports/token-service.port';
import { GetRoleScopeUseCase } from '../../application/use-cases/get-role-scope.use-case';
import { UserRole } from '../../domain/enums/user-role.enum';
import type { RoleScope } from '../../domain/services/role-scope.service';
import { CurrentAuth } from '../decorators/current-auth.decorator';
import { Roles } from '../decorators/roles.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Controller('areas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AreasController {
  constructor(private readonly getRoleScopeUseCase: GetRoleScopeUseCase) {}

  @Get('cliente')
  @Roles(UserRole.CLIENTE)
  getAreaCliente(@CurrentAuth() auth: AuthTokenPayload): RoleScope {
    return this.getRoleScopeUseCase.execute({ rol: auth.rol });
  }

  @Get('reparto')
  @Roles(UserRole.REPARTIDOR)
  getAreaReparto(@CurrentAuth() auth: AuthTokenPayload): RoleScope {
    return this.getRoleScopeUseCase.execute({ rol: auth.rol });
  }

  @Get('administracion')
  @Roles(UserRole.ADMINISTRADOR)
  getAreaAdministracion(@CurrentAuth() auth: AuthTokenPayload): RoleScope {
    return this.getRoleScopeUseCase.execute({ rol: auth.rol });
  }
}
