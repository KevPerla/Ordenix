import type { Producto } from '../../domain/entities/producto.entity';
import type { CategoriaRepository } from '../ports/categoria.repository.port';
import type { ProductoRepository } from '../ports/producto.repository.port';
import { CategoriaNoEncontradaError } from '../errors/categoria-no-encontrada.error';
import { ProductoNoEncontradoError } from '../errors/producto-no-encontrado.error';

export interface ActualizarProductoInput {
  id: string;
  categoriaId?: string;
  nombre?: string;
  descripcion?: string | null;
  precio?: number;
  imagenUrl?: string | null;
  stock?: number;
  disponible?: boolean;
}

export class ActualizarProductoUseCase {
  constructor(
    private readonly productos: ProductoRepository,
    private readonly categorias: CategoriaRepository,
  ) {}

  async execute(input: ActualizarProductoInput): Promise<Producto> {
    const producto = await this.productos.findById(input.id);

    if (!producto) {
      throw new ProductoNoEncontradoError(input.id);
    }

    if (input.categoriaId && input.categoriaId !== producto.categoriaId) {
      const categoria = await this.categorias.findById(input.categoriaId);

      if (!categoria) {
        throw new CategoriaNoEncontradaError(input.categoriaId);
      }

      producto.categoriaId = input.categoriaId;
    }

    if (input.nombre !== undefined) producto.nombre = input.nombre;
    if (input.descripcion !== undefined) producto.descripcion = input.descripcion;
    if (input.imagenUrl !== undefined) producto.imagenUrl = input.imagenUrl;
    if (input.disponible !== undefined) producto.disponible = input.disponible;
    if (input.precio !== undefined) producto.cambiarPrecio(input.precio);
    if (input.stock !== undefined) producto.ajustarStock(input.stock);

    return this.productos.save(producto);
  }
}
