import { IsEnum } from 'class-validator';
import { EstadoPedido } from '../../domain/enums/estado-pedido.enum';

export class CambiarEstadoDto {
  @IsEnum(EstadoPedido, {
    message:
      'El estado debe ser CREADO, PAGADO, EN_PREPARACION, EN_CAMINO, ENTREGADO o CANCELADO.',
  })
  estado!: EstadoPedido;
}
