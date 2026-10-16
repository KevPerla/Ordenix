import {
  validarNombreCategoria,
  validarProducto,
  type Categoria,
  type DatosProducto,
  type FiltroProductos,
  type Producto,
} from "@/domain/catalogo";
import { errorDeValidacion } from "../errores";
import type { CatalogoRepositorio } from "../puertos/catalogo";

export class CasosCatalogo {
  constructor(private readonly repositorio: CatalogoRepositorio) {}

  categorias(incluirInactivas = false): Promise<Categoria[]> {
    return this.repositorio.listarCategorias(incluirInactivas);
  }

  productos(filtro: FiltroProductos = {}): Promise<Producto[]> {
    return this.repositorio.listarProductos(filtro);
  }

  catalogoDelCliente(categoriaId?: string): Promise<Producto[]> {
    return this.repositorio.listarProductos({
      soloDisponibles: true,
      categoriaId: categoriaId || undefined,
    });
  }

  crearCategoria(nombre: string): Promise<Categoria> {
    const error = validarNombreCategoria(nombre);

    if (error) {
      throw errorDeValidacion(error);
    }

    return this.repositorio.crearCategoria({ nombre: nombre.trim() });
  }

  renombrarCategoria(categoria: Categoria, nombre: string): Promise<Categoria> {
    const error = validarNombreCategoria(nombre);

    if (error) {
      throw errorDeValidacion(error);
    }

    return this.repositorio.actualizarCategoria(categoria.id, { nombre: nombre.trim() });
  }

  alternarCategoria(categoria: Categoria): Promise<Categoria> {
    return this.repositorio.actualizarCategoria(categoria.id, { activo: !categoria.activo });
  }

  eliminarCategoria(id: string): Promise<void> {
    return this.repositorio.eliminarCategoria(id);
  }

  guardarProducto(datos: DatosProducto, id?: string): Promise<Producto> {
    const errores = validarProducto(datos);
    const primero = Object.values(errores)[0];

    if (primero) {
      throw errorDeValidacion(primero);
    }

    const limpio: DatosProducto = {
      ...datos,
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion?.trim() || undefined,
    };

    return id
      ? this.repositorio.actualizarProducto(id, limpio)
      : this.repositorio.crearProducto(limpio);
  }

  eliminarProducto(id: string): Promise<void> {
    return this.repositorio.eliminarProducto(id);
  }
}
