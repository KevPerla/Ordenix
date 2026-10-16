import { Producto } from '../../domain/entities/producto.entity';
import type { CategoriaRepository } from '../ports/categoria.repository.port';
import type { ProductoRepository } from '../ports/producto.repository.port';
import { CategoriaNoEncontradaError } from '../errors/categoria-no-encontrada.error';

export interface CrearProductoInput {
  categoriaId: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagenUrl: string | null;
  stock: number;
  disponible: boolean;
}

export class CrearProductoUseCase {
  constructor(
    private readonly productos: ProductoRepository,
    private readonly categorias: CategoriaRepository,
  ) {}

  async execute(input: CrearProductoInput): Promise<Producto> {
    Producto.validarPrecio(input.precio);
    Producto.validarStock(input.stock);

    const categoria = await this.categorias.findById(input.categoriaId);

    if (!categoria) {
      throw new CategoriaNoEncontradaError(input.categoriaId);
    }

    return this.productos.create(input);
  }
}
