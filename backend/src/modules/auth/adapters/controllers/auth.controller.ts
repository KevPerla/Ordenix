import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { EmailAlreadyExistsError } from '../../application/errors/email-already-exists.error';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { UserRole } from '../../domain/enums/user-role.enum';
import { RegisterUserDto } from '../dto/register-user.dto';

interface RegisterUserResponse {
  id: string;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  rol: UserRole;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

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
}
