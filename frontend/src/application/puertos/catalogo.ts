import type {
  Categoria,
  DatosCategoria,
  DatosProducto,
  FiltroProductos,
  Producto,
} from "@/domain/catalogo";

export interface CatalogoRepositorio {
  listarCategorias(incluirInactivas: boolean): Promise<Categoria[]>;
  crearCategoria(datos: DatosCategoria): Promise<Categoria>;
  actualizarCategoria(id: string, datos: Partial<DatosCategoria>): Promise<Categoria>;
  eliminarCategoria(id: string): Promise<void>;
  listarProductos(filtro: FiltroProductos): Promise<Producto[]>;
  crearProducto(datos: DatosProducto): Promise<Producto>;
  actualizarProducto(id: string, datos: DatosProducto): Promise<Producto>;
  eliminarProducto(id: string): Promise<void>;
}
