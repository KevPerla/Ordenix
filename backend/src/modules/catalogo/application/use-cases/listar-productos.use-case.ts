import type { Producto } from '../../domain/entities/producto.entity';
import type {
  FiltroProductos,
  ProductoRepository,
} from '../../domain/repositories/producto.repository.interface';

export class ListarProductosUseCase {
  constructor(private readonly repositorio: ProductoRepository) {}

  execute(filtro: FiltroProductos): Promise<Producto[]> {
    return this.repositorio.findAll(filtro);
  }
}
