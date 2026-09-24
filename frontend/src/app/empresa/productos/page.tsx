"use client";

import { FormEvent, useEffect, useState } from "react";
import PanelShell from "@/components/PanelShell";
import Campo, { CLASES_CONTROL } from "@/components/panel/Campo";
import Dialogo from "@/components/panel/Dialogo";
import EncabezadoPanel from "@/components/panel/EncabezadoPanel";
import EstadoVacio from "@/components/panel/EstadoVacio";
import Tarjeta from "@/components/panel/Tarjeta";
import { IconoCaja } from "@/components/panel/iconos";
import { useAviso } from "@/context/AvisoContext";
import {
  ApiError,
  actualizarProducto,
  crearCategoria,
  crearProducto,
  eliminarProducto,
  listarCategorias,
  listarProductos,
  type Categoria,
  type Producto,
} from "@/lib/api";
import { agregarIva, formatearMoneda } from "@/lib/moneda";

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

type Errores = Partial<Record<keyof Formulario, string>>;

function validar(valores: Formulario): Errores {
  const errores: Errores = {};

  if (!valores.categoriaId) {
    errores.categoriaId = "Elige una categoría";
  }

  if (valores.nombre.trim().length < 2) {
    errores.nombre = "Escribe al menos 2 caracteres";
  }

  const precio = Number(valores.precio);
  if (!valores.precio || !Number.isFinite(precio) || precio <= 0) {
    errores.precio = "El precio debe ser mayor que cero";
  }

  const stock = Number(valores.stock);
  if (valores.stock === "" || !Number.isInteger(stock) || stock < 0) {
    errores.stock = "El stock debe ser un entero mayor o igual que cero";
  }

  return errores;
}

export default function EmpresaProductosPage() {
  const { mostrarAviso } = useAviso();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [fallo, setFallo] = useState("");

  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<Producto | null>(null);
  const [valores, setValores] = useState<Formulario>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [guardando, setGuardando] = useState(false);

  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [creandoCategoria, setCreandoCategoria] = useState(false);

  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let vigente = true;

    Promise.all([
      listarCategorias(true),
      listarProductos(filtroCategoria ? { categoriaId: filtroCategoria } : {}),
    ])
      .then(([listaCategorias, listaProductos]) => {
        if (!vigente) return;
        setCategorias(listaCategorias);
        setProductos(listaProductos);
        setFallo("");
      })
      .catch((error: unknown) => {
        if (!vigente) return;
        setFallo(
          error instanceof ApiError
            ? error.message
            : "No se pudo cargar el catálogo",
        );
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [filtroCategoria, recarga]);

  function refrescar() {
    setCargando(true);
    setRecarga((numero) => numero + 1);
  }

  function abrirNuevo() {
    setEditando(null);
    setValores({ ...VACIO, categoriaId: categorias[0]?.id ?? "" });
    setErrores({});
    setAbierto(true);
  }

  function abrirEdicion(producto: Producto) {
    setEditando(producto);
    setValores({
      categoriaId: producto.categoriaId,
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? "",
      precio: String(producto.precioSinIva),
      stock: String(producto.stock),
      disponible: producto.disponible,
    });
    setErrores({});
    setAbierto(true);
  }

  async function guardar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const encontrados = validar(valores);
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      return;
    }

    setGuardando(true);

    const datos = {
      categoriaId: valores.categoriaId,
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim() || undefined,
      precio: Number(valores.precio),
      stock: Number(valores.stock),
      disponible: valores.disponible,
    };

    try {
      if (editando) {
        await actualizarProducto(editando.id, datos);
        mostrarAviso("Producto actualizado");
      } else {
        await crearProducto(datos);
        mostrarAviso("Producto creado");
      }

      setAbierto(false);
      refrescar();
    } catch (error: unknown) {
      mostrarAviso(
        error instanceof ApiError ? error.message : "No se pudo guardar",
        "error",
      );
    } finally {
      setGuardando(false);
    }
  }

  async function borrar(producto: Producto) {
    try {
      await eliminarProducto(producto.id);
      mostrarAviso("Producto eliminado");
      refrescar();
    } catch (error: unknown) {
      mostrarAviso(
        error instanceof ApiError ? error.message : "No se pudo eliminar",
        "error",
      );
    }
  }

  async function agregarCategoria() {
    if (nuevaCategoria.trim().length < 2) {
      return;
    }

    setCreandoCategoria(true);

    try {
      const creada = await crearCategoria({ nombre: nuevaCategoria.trim() });
      setCategorias((previas) => [...previas, creada]);
      setNuevaCategoria("");
      mostrarAviso("Categoría creada");
    } catch (error: unknown) {
      mostrarAviso(
        error instanceof ApiError
          ? error.message
          : "No se pudo crear la categoría",
        "error",
      );
    } finally {
      setCreandoCategoria(false);
    }
  }

  function nombreCategoria(id: string): string {
    return categorias.find((categoria) => categoria.id === id)?.nombre ?? "—";
  }

  return (
    <PanelShell area="empresa" titulo="Productos">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Catálogo"
          nombre="Productos"
          descripcion="Crea, edita y retira productos. El precio se guarda sin IVA y el catálogo muestra ambos valores."
          accion={
            <button
              type="button"
              onClick={abrirNuevo}
              disabled={categorias.length === 0}
              className="presionable inline-flex h-11 items-center rounded-[var(--radius-control)] bg-brand-700 px-5 text-[14px] font-bold text-white shadow-[var(--sombra-media)] hover:bg-brand-800 disabled:opacity-50"
            >
              Nuevo producto
            </button>
          }
        />

        <Tarjeta
          titulo="Categorías"
          descripcion="Todo producto pertenece a una categoría"
        >
          <div className="flex flex-wrap items-center gap-2 px-5 py-4">
            {categorias.map((categoria) => (
              <span
                key={categoria.id}
                className="rounded-full border border-line bg-ink-50 px-3 py-1.5 text-[12.5px] font-semibold text-ink-700"
              >
                {categoria.nombre}
              </span>
            ))}

            {categorias.length === 0 && (
              <p className="text-[13px] text-ink-500">
                Todavía no hay categorías. Crea la primera para poder registrar
                productos.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 border-t border-line-soft px-5 py-4 sm:flex-row">
            <input
              value={nuevaCategoria}
              onChange={(evento) => setNuevaCategoria(evento.target.value)}
              placeholder="Nombre de la categoría"
              aria-label="Nombre de la categoría"
              className={CLASES_CONTROL}
            />

            <button
              type="button"
              onClick={() => void agregarCategoria()}
              disabled={creandoCategoria || nuevaCategoria.trim().length < 2}
              className="presionable h-11 shrink-0 rounded-[var(--radius-control)] border border-line bg-surface px-5 text-[13.5px] font-bold text-ink-700 hover:border-brand-300 hover:text-brand-700 disabled:opacity-50"
            >
              Agregar
            </button>
          </div>
        </Tarjeta>

        <Tarjeta
          titulo="Inventario"
          descripcion={`${productos.length} producto(s)`}
          accion={
            <select
              value={filtroCategoria}
              onChange={(evento) => {
                setCargando(true);
                setFiltroCategoria(evento.target.value);
              }}
              aria-label="Filtrar por categoría"
              className="h-9 rounded-[var(--radius-control)] border border-line bg-ink-50 px-3 text-[13px] font-semibold text-ink-700 outline-none focus:border-brand-300"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          }
        >
          {cargando ? (
            <div className="space-y-2 p-5">
              {[0, 1, 2].map((fila) => (
                <div key={fila} className="esqueleto h-12 rounded-xl" />
              ))}
            </div>
          ) : fallo ? (
            <div role="alert" className="px-5 py-6 text-[13.5px] text-red-600">
              {fallo}
            </div>
          ) : productos.length === 0 ? (
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
                  {productos.map((producto) => (
                    <tr key={producto.id} className="text-[13.5px]">
                      <td className="px-5 py-3">
                        <p className="font-bold text-ink-900">
                          {producto.nombre}
                        </p>

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
                            producto.stock === 0
                              ? "font-bold text-red-600"
                              : producto.stock < 5
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
                            className="presionable rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-bold text-ink-700 hover:border-brand-300 hover:text-brand-700"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => void borrar(producto)}
                            className="presionable rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-bold text-ink-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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
          <Campo
            etiqueta="Categoría"
            htmlFor="categoriaId"
            error={errores.categoriaId}
          >
            <select
              id="categoriaId"
              value={valores.categoriaId}
              onChange={(evento) =>
                setValores((previos) => ({
                  ...previos,
                  categoriaId: evento.target.value,
                }))
              }
              className={CLASES_CONTROL}
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
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
              onChange={(evento) =>
                setValores((previos) => ({
                  ...previos,
                  nombre: evento.target.value,
                }))
              }
              className={CLASES_CONTROL}
              placeholder="Pupusa revuelta"
            />
          </Campo>

          <Campo etiqueta="Descripción" htmlFor="descripcion" ayuda="Opcional">
            <input
              id="descripcion"
              value={valores.descripcion}
              onChange={(evento) =>
                setValores((previos) => ({
                  ...previos,
                  descripcion: evento.target.value,
                }))
              }
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
                onChange={(evento) =>
                  setValores((previos) => ({
                    ...previos,
                    precio: evento.target.value,
                  }))
                }
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
                onChange={(evento) =>
                  setValores((previos) => ({
                    ...previos,
                    stock: evento.target.value,
                  }))
                }
                className={CLASES_CONTROL}
              />
            </Campo>
          </div>

          <label className="flex items-center gap-2.5 text-[13.5px] font-medium text-ink-700">
            <input
              type="checkbox"
              checked={valores.disponible}
              onChange={(evento) =>
                setValores((previos) => ({
                  ...previos,
                  disponible: evento.target.checked,
                }))
              }
              className="h-4 w-4 accent-brand-600"
            />
            Disponible en el catálogo
          </label>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={guardando}
              className="presionable h-11 flex-1 rounded-[var(--radius-control)] bg-brand-700 text-[14px] font-bold text-white hover:bg-brand-800 disabled:opacity-60"
            >
              {guardando
                ? "Guardando"
                : editando
                  ? "Guardar cambios"
                  : "Crear producto"}
            </button>

            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="presionable h-11 rounded-[var(--radius-control)] border border-line px-5 text-[14px] font-bold text-ink-700 hover:bg-ink-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Dialogo>
    </PanelShell>
  );
}
