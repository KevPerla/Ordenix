import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailAlreadyExistsError } from '../../application/errors/email-already-exists.error';
import { InvalidCredentialsError } from '../../application/errors/invalid-credentials.error';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { UserRole } from '../../domain/enums/user-role.enum';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';

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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
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
}
