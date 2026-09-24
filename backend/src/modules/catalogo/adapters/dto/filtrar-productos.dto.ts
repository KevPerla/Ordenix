import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class FiltrarProductosDto {
  @IsOptional()
  @IsUUID('4', { message: 'La categoria no es valida.' })
  categoriaId?: string;

  @IsOptional()
  @IsBoolean({ message: 'El filtro de disponibles debe ser verdadero o falso.' })
  @Transform(({ value }) => value === 'true' || value === true)
  soloDisponibles?: boolean;

  @IsOptional()
  @MaxLength(100, { message: 'La busqueda es demasiado larga.' })
  @IsString({ message: 'La busqueda no es valida.' })
  busqueda?: string;
}
