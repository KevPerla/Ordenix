import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginUserDto {
  @MaxLength(255, { message: 'El correo no puede superar los 255 caracteres.' })
  @IsEmail({}, { message: 'El correo no tiene un formato válido.' })
  @IsNotEmpty({ message: 'Escribe tu correo.' })
  correo!: string;

  @IsString({ message: 'La contraseña no es válida.' })
  @IsNotEmpty({ message: 'Escribe tu contraseña.' })
  password!: string;
}
