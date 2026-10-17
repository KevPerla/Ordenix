import type { Producto } from '../../domain/entities/producto.entity';
import type {
  FiltroProductos,
  ProductoRepository,
} from '../ports/producto.repository.port';

export class ListarProductosUseCase {
  constructor(private readonly repositorio: ProductoRepository) {}

  execute(filtro: FiltroProductos): Promise<Producto[]> {
    return this.repositorio.findAll(filtro);
  }
}
