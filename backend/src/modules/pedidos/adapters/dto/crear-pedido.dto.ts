import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class LineaPedidoDto {
  @IsUUID('4', { message: 'El producto no es valido.' })
  productoId!: string;

  @Min(1, { message: 'La cantidad debe ser al menos 1.' })
  @IsInt({ message: 'La cantidad debe ser un numero entero.' })
  @Type(() => Number)
  cantidad!: number;
}

export class CrearPedidoDto {
  @MaxLength(500, { message: 'La direccion es demasiado larga.' })
  @MinLength(8, { message: 'Escribe una direccion mas completa.' })
  @IsString({ message: 'La direccion no es valida.' })
  direccionCompleta!: string;

  @IsOptional()
  @MaxLength(255, { message: 'La referencia es demasiado larga.' })
  @IsString({ message: 'La referencia no es valida.' })
  referencia?: string;

  @IsOptional()
  @MaxLength(500, { message: 'Las notas son demasiado largas.' })
  @IsString({ message: 'Las notas no son validas.' })
  notas?: string;

  @ArrayMaxSize(50, { message: 'El pedido no puede tener mas de 50 lineas.' })
  @ArrayMinSize(1, { message: 'El pedido debe tener al menos un producto.' })
  @ValidateNested({ each: true })
  @Type(() => LineaPedidoDto)
  @IsArray({ message: 'Las lineas del pedido no son validas.' })
  lineas!: LineaPedidoDto[];
}
