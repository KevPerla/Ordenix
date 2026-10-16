import type { CatalogoRepositorio } from "@/application/puertos/catalogo";
import type {
  Categoria,
  DatosCategoria,
  DatosProducto,
  FiltroProductos,
  Producto,
} from "@/domain/catalogo";
import type { ClienteHttp } from "./cliente-http";

export class CatalogoHttp implements CatalogoRepositorio {
  constructor(private readonly http: ClienteHttp) {}

  listarCategorias(incluirInactivas: boolean): Promise<Categoria[]> {
    return this.http.get(
      `/categorias${incluirInactivas ? "?incluirInactivas=true" : ""}`,
    );
  }

  crearCategoria(datos: DatosCategoria): Promise<Categoria> {
    return this.http.post("/categorias", datos);
  }

  actualizarCategoria(id: string, datos: Partial<DatosCategoria>): Promise<Categoria> {
    return this.http.patch(`/categorias/${id}`, datos);
  }

  eliminarCategoria(id: string): Promise<void> {
    return this.http.delete(`/categorias/${id}`);
  }

  listarProductos(filtro: FiltroProductos): Promise<Producto[]> {
    const parametros = new URLSearchParams();

    if (filtro.categoriaId) parametros.set("categoriaId", filtro.categoriaId);
    if (filtro.soloDisponibles) parametros.set("soloDisponibles", "true");
    if (filtro.busqueda) parametros.set("busqueda", filtro.busqueda);

    const consulta = parametros.toString();
    return this.http.get(`/productos${consulta ? `?${consulta}` : ""}`);
  }

  crearProducto(datos: DatosProducto): Promise<Producto> {
    return this.http.post("/productos", datos);
  }

  actualizarProducto(id: string, datos: DatosProducto): Promise<Producto> {
    return this.http.patch(`/productos/${id}`, datos);
  }

  eliminarProducto(id: string): Promise<void> {
    return this.http.delete(`/productos/${id}`);
  }
}
