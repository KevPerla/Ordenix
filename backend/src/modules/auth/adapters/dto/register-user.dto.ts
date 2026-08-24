import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreCompleto!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  correo!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  telefono!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;
}
