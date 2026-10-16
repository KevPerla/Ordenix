import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ActualizarCategoriaDto {
  @IsOptional()
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @IsString({ message: 'El nombre no es valido.' })
  nombre?: string;

  @IsOptional()
  @MaxLength(500, {
    message: 'La descripcion no puede superar los 500 caracteres.',
  })
  @IsString({ message: 'La descripcion no es valida.' })
  descripcion?: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser verdadero o falso.' })
  activo?: boolean;
}
