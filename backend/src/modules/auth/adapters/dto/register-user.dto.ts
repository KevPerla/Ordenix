import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres.' })
  @IsString({ message: 'El nombre no es válido.' })
  @IsNotEmpty({ message: 'Escribe tu nombre completo.' })
  nombreCompleto!: string;

  @MaxLength(255, { message: 'El correo no puede superar los 255 caracteres.' })
  @IsEmail({}, { message: 'El correo no tiene un formato válido.' })
  @IsNotEmpty({ message: 'Escribe tu correo.' })
  correo!: string;

  @MaxLength(30, { message: 'El teléfono no puede superar los 30 caracteres.' })
  @IsString({ message: 'El teléfono no es válido.' })
  @IsNotEmpty({ message: 'Escribe tu teléfono.' })
  telefono!: string;

  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @IsString({ message: 'La contraseña no es válida.' })
  @IsNotEmpty({ message: 'Crea una contraseña.' })
  password!: string;
}
