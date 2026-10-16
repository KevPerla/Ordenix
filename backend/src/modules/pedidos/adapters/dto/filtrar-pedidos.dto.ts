import { IsEnum, IsOptional } from 'class-validator';
import { EstadoPedido } from '../../domain/enums/estado-pedido.enum';

export class FiltrarPedidosDto {
  @IsOptional()
  @IsEnum(EstadoPedido, { message: 'El estado no es valido.' })
  estado?: EstadoPedido;
}
