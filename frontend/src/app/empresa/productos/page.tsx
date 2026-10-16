"use client";

import { useState, type FormEvent } from "react";
import { mensajeDeError } from "@/application/errores";
import {
  estaAgotado,
  quedanPocas,
  validarProducto,
  type Categoria,
  type DatosProducto,
  type ErroresProducto,
  type Producto,
} from "@/domain/catalogo";
import { agregarIva } from "@/domain/impuestos";
import { catalogo } from "@/infrastructure/contenedor";
import PanelShell from "@/presentation/components/PanelShell";
import Campo, { CLASES_CONTROL } from "@/presentation/components/panel/Campo";
import Dialogo from "@/presentation/components/panel/Dialogo";
import EncabezadoPanel from "@/presentation/components/panel/EncabezadoPanel";
import EstadoVacio from "@/presentation/components/panel/EstadoVacio";
import Tarjeta from "@/presentation/components/panel/Tarjeta";
import {
  BOTON_COMPACTO,
  BOTON_COMPACTO_PELIGRO,
  BOTON_PRIMARIO,
  BOTON_SECUNDARIO,
} from "@/presentation/components/panel/estilos";
import { IconoCaja } from "@/presentation/components/panel/iconos";
import { useAviso } from "@/presentation/contexto/AvisoContext";
import { formatearMoneda } from "@/presentation/formato/moneda";
import { useConsulta } from "@/presentation/hooks/useConsulta";

interface Formulario {
  categoriaId: string;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  disponible: boolean;
}

const VACIO: Formulario = {
  categoriaId: "",
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  disponible: true,
};

function aDatos(valores: Formulario): DatosProducto {
  return {
    categoriaId: valores.categoriaId,
    nombre: valores.nombre,
    descripcion: valores.descripcion,
    precio: valores.precio === "" ? Number.NaN : Number(valores.precio),
    stock: valores.stock === "" ? Number.NaN : Number(valores.stock),
    disponible: valores.disponible,
  };
}

function desdeProducto(producto: Producto): Formulario {
  return {
    categoriaId: producto.categoriaId,
    nombre: producto.nombre,
    descripcion: producto.descripcion ?? "",
    precio: String(producto.precioSinIva),
    stock: String(producto.stock),
    disponible: producto.disponible,
  };
}

export default function EmpresaProductosPage() {
  const { mostrarAviso } = useAviso();

  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [porEliminar, setPorEliminar] = useState<Producto | null>(null);
  const [valores, setValores] = useState<Formulario>(VACIO);
  const [errores, setErrores] = useState<ErroresProducto>({});
  const [guardando, setGuardando] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [creandoCategoria, setCreandoCategoria] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
  const [nombreCategoriaEditado, setNombreCategoriaEditado] = useState("");
  const [categoriaPorEliminar, setCategoriaPorEliminar] = useState<Categoria | null>(null);

  const categorias = useConsulta(() => catalogo.categorias(true), []);
  const productos = useConsulta(
    () => catalogo.productos({ categoriaId: filtroCategoria || undefined }),
    [filtroCategoria],
    { respaldo: "No se pudo cargar el inventario" },
  );

  const listaCategorias = categorias.datos ?? [];
  const listaProductos = productos.datos ?? [];

  function cambiar<K extends keyof Formulario>(campo: K, valor: Formulario[K]) {
    setValores((previos) => ({ ...previos, [campo]: valor }));
    setErrores((previos) => ({ ...previos, [campo]: undefined }));
  }

  function abrirNuevo() {
    setEditando(null);
    setValores({ ...VACIO, categoriaId: listaCategorias[0]?.id ?? "" });
    setErrores({});
    setAbierto(true);
  }

  function abrirEdicion(producto: Producto) {
    setEditando(producto);
    setValores(desdeProducto(producto));
    setErrores({});
    setAbierto(true);
  }

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const datos = aDatos(valores);
    const encontrados = validarProducto(datos);
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      return;
    }

    setGuardando(true);

    try {
      await catalogo.guardarProducto(datos, editando?.id);
      mostrarAviso(editando ? "Producto actualizado" : "Producto creado");
      setAbierto(false);
      productos.recargar();
    } catch (error: unknown) {
      mostrarAviso(mensajeDeError(error, "No se pudo guardar el producto"), "error");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(producto: Producto) {
    setPorEliminar(null);

    try {
      await catalogo.eliminarProducto(producto.id);
      mostrarAviso("Producto eliminado");
      productos.recargar();
    } catch (error: unknown) {
      mostrarAviso(mensajeDeError(error, "No se pudo eliminar el producto"), "error");
    }
  }

  async function agregarCategoria() {
    setCreandoCategoria(true);

    try {
      await catalogo.crearCategoria(nuevaCategoria);
      setNuevaCategoria("");
      mostrarAviso("Categoría creada");
      categorias.recargar();
    } catch (error: unknown) {
      mostrarAviso(mensajeDeError(error, "No se pudo crear la categoría"), "error");
    } finally {
      setCreandoCategoria(false);
    }
  }

  async function renombrarCategoria(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!categoriaEditando) return;

    try {
      await catalogo.renombrarCategoria(categoriaEditando, nombreCategoriaEditado);
      mostrarAviso("Categoría actualizada");
      setCategoriaEditando(null);
      categorias.recargar();
    } catch (error: unknown) {
      mostrarAviso(mensajeDeError(error, "No se pudo renombrar la categoría"), "error");
    }
  }

  async function alternarCategoria(categoria: Categoria) {
    try {
      await catalogo.alternarCategoria(categoria);
      mostrarAviso(categoria.activo ? "Categoría desactivada" : "Categoría activada");
      categorias.recargar();
    } catch (error: unknown) {
      mostrarAviso(mensajeDeError(error, "No se pudo cambiar la categoría"), "error");
    }
  }

  async function eliminarCategoria(categoria: Categoria) {
    setCategoriaPorEliminar(null);

    try {
      await catalogo.eliminarCategoria(categoria.id);
      mostrarAviso("Categoría eliminada");
      categorias.recargar();
    } catch (error: unknown) {
      mostrarAviso(mensajeDeError(error, "No se pudo eliminar la categoría"), "error");
    }
  }

  function nombreCategoria(id: string): string {
    return listaCategorias.find((categoria) => categoria.id === id)?.nombre ?? "—";
  }

  return (
    <PanelShell area="empresa" titulo="Productos">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Catálogo"
          nombre="Productos"
          descripcion="Crea, edita y retira productos. El precio se guarda sin IVA y el catálogo del cliente muestra ambos valores al instante."
          accion={
            <button
              type="button"
              onClick={abrirNuevo}
              disabled={listaCategorias.length === 0}
              className={BOTON_PRIMARIO}
            >
              Nuevo producto
            </button>
          }
        />

        <Tarjeta titulo="Categorías" descripcion="Todo producto pertenece a una categoría">
          {!categorias.cargando && listaCategorias.length === 0 ? (
            <p className="px-5 py-4 text-[13px] text-ink-500">
              Crea la primera categoría para poder registrar productos.
            </p>
          ) : (
            <ul className="divide-y divide-line-soft">
              {listaCategorias.map((categoria) => (
                <li
                  key={categoria.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`text-[13.5px] font-bold ${
                        categoria.activo ? "text-ink-900" : "text-ink-400 line-through"
                      }`}
                    >
                      {categoria.nombre}
                    </span>
                    {!categoria.activo && (
                      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-bold text-ink-500">
                        Oculta al cliente
                      </span>
                    )}
                  </span>

                  <span className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCategoriaEditando(categoria);
                        setNombreCategoriaEditado(categoria.nombre);
                      }}
                      className={BOTON_COMPACTO}
                    >
                      Renombrar
                    </button>
                    <button
                      type="button"
                      onClick={() => void alternarCategoria(categoria)}
                      className={BOTON_COMPACTO}
                    >
                      {categoria.activo ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoriaPorEliminar(categoria)}
                      className={BOTON_COMPACTO_PELIGRO}
                    >
                      Eliminar
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={(evento) => {
              evento.preventDefault();
              void agregarCategoria();
            }}
            className="flex flex-col gap-2 border-t border-line-soft px-5 py-4 sm:flex-row"
          >
            <input
              value={nuevaCategoria}
              onChange={(evento) => setNuevaCategoria(evento.target.value)}
              placeholder="Nombre de la categoría"
              aria-label="Nombre de la categoría"
              className={CLASES_CONTROL}
            />

            <button
              type="submit"
              disabled={creandoCategoria || nuevaCategoria.trim().length < 2}
              className={`${BOTON_SECUNDARIO} shrink-0`}
            >
              Agregar categoría
            </button>
          </form>
        </Tarjeta>

        <Tarjeta
          titulo="Inventario"
          descripcion={`${listaProductos.length} ${listaProductos.length === 1 ? "producto" : "productos"}`}
          accion={
            <select
              value={filtroCategoria}
              onChange={(evento) => setFiltroCategoria(evento.target.value)}
              aria-label="Filtrar por categoría"
              className="h-9 rounded-[var(--radius-control)] border border-line bg-ink-50 px-3 text-[13px] font-semibold text-ink-700 outline-none focus:border-brand-300"
            >
              <option value="">Todas las categorías</option>
              {listaCategorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          }
        >
          {productos.cargando ? (
            <div className="space-y-2 p-5">
              {[0, 1, 2].map((fila) => (
                <div key={fila} className="esqueleto h-12 rounded-xl" />
              ))}
            </div>
          ) : productos.error && listaProductos.length === 0 ? (
            <p role="alert" className="px-5 py-6 text-[13.5px] text-red-600">
              {productos.error}
            </p>
          ) : listaProductos.length === 0 ? (
            <EstadoVacio
              icono={IconoCaja}
              titulo="Sin productos"
              descripcion="Registra el primer producto para que aparezca en el catálogo del cliente."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-line-soft text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink-500">
                    <th className="px-5 py-3">Producto</th>
                    <th className="px-3 py-3">Categoría</th>
                    <th className="px-3 py-3 text-right">Precio sin IVA</th>
                    <th className="px-3 py-3 text-right">IVA 13%</th>
                    <th className="px-3 py-3 text-right">Precio con IVA</th>
                    <th className="px-3 py-3 text-right">Stock</th>
                    <th className="px-5 py-3 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-line-soft">
                  {listaProductos.map((producto) => (
                    <tr key={producto.id} className="text-[13.5px]">
                      <td className="px-5 py-3">
                        <p className="font-bold text-ink-900">{producto.nombre}</p>
                        {!producto.disponible && (
                          <span className="mt-0.5 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                            No disponible
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-ink-600">
                        {nombreCategoria(producto.categoriaId)}
                      </td>
                      <td className="numero-tabular px-3 py-3 text-right text-ink-700">
                        {formatearMoneda(producto.precioSinIva)}
                      </td>
                      <td className="numero-tabular px-3 py-3 text-right text-ink-500">
                        {formatearMoneda(producto.iva)}
                      </td>
                      <td className="numero-tabular px-3 py-3 text-right font-bold text-ink-900">
                        {formatearMoneda(producto.precioConIva)}
                      </td>
                      <td className="numero-tabular px-3 py-3 text-right">
                        <span
                          className={
                            estaAgotado(producto)
                              ? "font-bold text-red-600"
                              : quedanPocas(producto)
                                ? "font-bold text-amber-600"
                                : "text-ink-700"
                          }
                        >
                          {producto.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => abrirEdicion(producto)}
                            className={BOTON_COMPACTO}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => setPorEliminar(producto)}
                            className={BOTON_COMPACTO_PELIGRO}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Tarjeta>
      </div>

      <Dialogo
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        titulo={editando ? "Editar producto" : "Nuevo producto"}
        descripcion="El precio se registra sin IVA. El impuesto se calcula solo."
      >
        <form onSubmit={guardar} className="space-y-4" noValidate>
          <Campo etiqueta="Categoría" htmlFor="categoriaId" error={errores.categoriaId}>
            <select
              id="categoriaId"
              value={valores.categoriaId}
              onChange={(evento) => cambiar("categoriaId", evento.target.value)}
              className={CLASES_CONTROL}
            >
              <option value="">Selecciona una categoría</option>
              {listaCategorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </Campo>

          <Campo etiqueta="Nombre" htmlFor="nombre" error={errores.nombre}>
            <input
              id="nombre"
              value={valores.nombre}
              onChange={(evento) => cambiar("nombre", evento.target.value)}
              className={CLASES_CONTROL}
              placeholder="Pupusa revuelta"
            />
          </Campo>

          <Campo etiqueta="Descripción" htmlFor="descripcion" ayuda="Opcional">
            <input
              id="descripcion"
              value={valores.descripcion}
              onChange={(evento) => cambiar("descripcion", evento.target.value)}
              className={CLASES_CONTROL}
            />
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              etiqueta="Precio sin IVA"
              htmlFor="precio"
              error={errores.precio}
              ayuda={
                Number(valores.precio) > 0
                  ? `Con IVA: ${formatearMoneda(agregarIva(Number(valores.precio)))}`
                  : undefined
              }
            >
              <input
                id="precio"
                type="number"
                step="0.01"
                min="0.01"
                inputMode="decimal"
                value={valores.precio}
                onChange={(evento) => cambiar("precio", evento.target.value)}
                className={CLASES_CONTROL}
              />
            </Campo>

            <Campo etiqueta="Stock" htmlFor="stock" error={errores.stock}>
              <input
                id="stock"
                type="number"
                step="1"
                min="0"
                inputMode="numeric"
                value={valores.stock}
                onChange={(evento) => cambiar("stock", evento.target.value)}
                className={CLASES_CONTROL}
              />
            </Campo>
          </div>

          <label className="flex items-center gap-2.5 text-[13.5px] font-medium text-ink-700">
            <input
              type="checkbox"
              checked={valores.disponible}
              onChange={(evento) => cambiar("disponible", evento.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            Disponible en el catálogo
          </label>

          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={guardando} className={`${BOTON_PRIMARIO} flex-1`}>
              {guardando ? "Guardando" : editando ? "Guardar cambios" : "Crear producto"}
            </button>
            <button type="button" onClick={() => setAbierto(false)} className={BOTON_SECUNDARIO}>
              Cancelar
            </button>
          </div>
        </form>
      </Dialogo>

      <Dialogo
        abierto={porEliminar !== null}
        onCerrar={() => setPorEliminar(null)}
        titulo={`¿Eliminar ${porEliminar?.nombre ?? "el producto"}?`}
        descripcion="Desaparece del catálogo y del inventario. Si ya está en algún pedido no se puede eliminar; en ese caso márcalo como no disponible."
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setPorEliminar(null)}
            className={`${BOTON_SECUNDARIO} flex-1`}
          >
            Conservar
          </button>
          <button
            type="button"
            onClick={() => porEliminar && void eliminar(porEliminar)}
            className="presionable inline-flex h-11 flex-1 items-center justify-center rounded-[var(--radius-control)] bg-red-600 px-5 text-[14px] font-bold text-white hover:bg-red-700"
          >
            Eliminar producto
          </button>
        </div>
      </Dialogo>

      <Dialogo
        abierto={categoriaEditando !== null}
        onCerrar={() => setCategoriaEditando(null)}
        titulo="Renombrar categoría"
        descripcion="El nuevo nombre se ve de inmediato en el filtro del catálogo del cliente."
      >
        <form onSubmit={renombrarCategoria} className="space-y-4" noValidate>
          <Campo etiqueta="Nombre" htmlFor="nombreCategoria">
            <input
              id="nombreCategoria"
              value={nombreCategoriaEditado}
              onChange={(evento) => setNombreCategoriaEditado(evento.target.value)}
              className={CLASES_CONTROL}
            />
          </Campo>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={nombreCategoriaEditado.trim().length < 2}
              className={`${BOTON_PRIMARIO} flex-1`}
            >
              Guardar nombre
            </button>
            <button
              type="button"
              onClick={() => setCategoriaEditando(null)}
              className={BOTON_SECUNDARIO}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Dialogo>

      <Dialogo
        abierto={categoriaPorEliminar !== null}
        onCerrar={() => setCategoriaPorEliminar(null)}
        titulo={`¿Eliminar ${categoriaPorEliminar?.nombre ?? "la categoría"}?`}
        descripcion="Solo se puede eliminar una categoría sin productos. Si tiene productos, desactívala para ocultarla al cliente."
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setCategoriaPorEliminar(null)}
            className={`${BOTON_SECUNDARIO} flex-1`}
          >
            Conservar
          </button>
          <button
            type="button"
            onClick={() => categoriaPorEliminar && void eliminarCategoria(categoriaPorEliminar)}
            className="presionable inline-flex h-11 flex-1 items-center justify-center rounded-[var(--radius-control)] bg-red-600 px-5 text-[14px] font-bold text-white hover:bg-red-700"
          >
            Eliminar categoría
          </button>
        </div>
      </Dialogo>
    </PanelShell>
  );
}
