import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ActualizarProductoDto {
  @IsOptional()
  @IsUUID('4', { message: 'La categoria no es valida.' })
  categoriaId?: string;

  @IsOptional()
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @IsString({ message: 'El nombre no es valido.' })
  nombre?: string;

  @IsOptional()
  @MaxLength(1000, {
    message: 'La descripcion no puede superar los 1000 caracteres.',
  })
  @IsString({ message: 'La descripcion no es valida.' })
  descripcion?: string;

  @IsOptional()
  @Min(0.01, { message: 'El precio debe ser mayor que cero.' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un numero con hasta dos decimales.' },
  )
  @Type(() => Number)
  precio?: number;

  @IsOptional()
  @MaxLength(500, { message: 'La URL de imagen es demasiado larga.' })
  @IsString({ message: 'La URL de imagen no es valida.' })
  imagenUrl?: string;

  @IsOptional()
  @Min(0, { message: 'El stock no puede ser negativo.' })
  @IsInt({ message: 'El stock debe ser un numero entero.' })
  @Type(() => Number)
  stock?: number;

  @IsOptional()
  @IsBoolean({ message: 'La disponibilidad debe ser verdadera o falsa.' })
  disponible?: boolean;
}
