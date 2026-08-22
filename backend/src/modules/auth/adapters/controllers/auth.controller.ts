import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CurrentUserUnavailableError } from '../../application/errors/current-user-unavailable.error';
import { EmailAlreadyExistsError } from '../../application/errors/email-already-exists.error';
import { InvalidCredentialsError } from '../../application/errors/invalid-credentials.error';
import type { AuthTokenPayload } from '../../application/ports/token-service.port';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { UserRole } from '../../domain/enums/user-role.enum';
import { CurrentAuth } from '../decorators/current-auth.decorator';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

interface RegisterUserResponse {
  id: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  rol: UserRole;
}

interface LoginUserResponse {
  accessToken: string;
  user: {
    id: string;
    nombreCompleto: string;
    correo: string;
    rol: UserRole;
  };
}

interface CurrentUserResponse {
  id: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  rol: UserRole;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto): Promise<RegisterUserResponse> {
    try {
      const user = await this.registerUserUseCase.execute(dto);

      return {
        id: user.id,
        nombreCompleto: user.nombreCompleto,
        correo: user.correo,
        telefono: user.telefono,
        rol: user.rol,
      };
    } catch (error: unknown) {
      if (error instanceof EmailAlreadyExistsError) {
        throw new ConflictException('El correo ya está registrado.');
      }

      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto): Promise<LoginUserResponse> {
    try {
      const result = await this.loginUserUseCase.execute(dto);

      return {
        accessToken: result.accessToken,
        user: {
          id: result.user.id,
          nombreCompleto: result.user.nombreCompleto,
          correo: result.user.correo,
          rol: result.user.rol,
        },
      };
    } catch (error: unknown) {
      if (error instanceof InvalidCredentialsError) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      throw error;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @CurrentAuth() auth: AuthTokenPayload,
  ): Promise<CurrentUserResponse> {
    try {
      const user = await this.getCurrentUserUseCase.execute({ userId: auth.sub });

      return {
        id: user.id,
        nombreCompleto: user.nombreCompleto,
        correo: user.correo,
        telefono: user.telefono,
        rol: user.rol,
      };
    } catch (error: unknown) {
      if (error instanceof CurrentUserUnavailableError) {
        throw new UnauthorizedException('No autorizado');
      }

      throw error;
    }
  }
}
