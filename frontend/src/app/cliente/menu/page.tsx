"use client";

import { useEffect, useState } from "react";
import PanelShell from "@/components/PanelShell";
import EncabezadoPanel from "@/components/panel/EncabezadoPanel";
import EstadoVacio from "@/components/panel/EstadoVacio";
import Tarjeta from "@/components/panel/Tarjeta";
import { IconoCaja } from "@/components/panel/iconos";
import {
  ApiError,
  listarCategorias,
  listarProductos,
  type Categoria,
  type Producto,
} from "@/lib/api";
import { formatearMoneda } from "@/lib/moneda";

const TODAS = "";

export default function ClienteMenuPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState(TODAS);
  const [cargando, setCargando] = useState(true);
  const [fallo, setFallo] = useState("");

  useEffect(() => {
    let vigente = true;

    Promise.all([
      listarCategorias(),
      listarProductos({
        soloDisponibles: true,
        ...(categoriaActiva ? { categoriaId: categoriaActiva } : {}),
      }),
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
  }, [categoriaActiva]);

  function cambiarCategoria(id: string) {
    setCargando(true);
    setCategoriaActiva(id);
  }

  const filtros = [{ id: TODAS, nombre: "Todo" }, ...categorias];

  return (
    <PanelShell area="cliente" titulo="Catálogo">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Catálogo"
          nombre="Qué vas a pedir"
          descripcion="Los precios se muestran sin IVA y con el 13% ya aplicado, para que sepas exactamente cuánto pagas."
        />

        <div
          role="group"
          aria-label="Filtrar por categoría"
          className="flex flex-wrap gap-2"
        >
          {filtros.map((filtro) => {
            const activo = filtro.id === categoriaActiva;

            return (
              <button
                key={filtro.id || "todo"}
                type="button"
                aria-pressed={activo}
                onClick={() => cambiarCategoria(filtro.id)}
                className={`presionable h-9 rounded-full border px-4 text-[13px] font-bold ${
                  activo
                    ? "border-brand-700 bg-brand-700 text-white shadow-[var(--sombra-baja)]"
                    : "border-line bg-surface text-ink-600 hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                {filtro.nombre}
              </button>
            );
          })}
        </div>

        {cargando ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((tarjeta) => (
              <div key={tarjeta} className="esqueleto h-[168px] rounded-[var(--radius-card)]" />
            ))}
          </div>
        ) : fallo ? (
          <Tarjeta titulo="No se pudo cargar">
            <div role="alert" className="px-5 py-6 text-[13.5px] text-red-600">
              {fallo}
            </div>
          </Tarjeta>
        ) : productos.length === 0 ? (
          <Tarjeta titulo="Catálogo vacío">
            <EstadoVacio
              icono={IconoCaja}
              titulo="No hay productos en esta categoría"
              descripcion="Prueba con otra categoría o vuelve más tarde: el catálogo se actualiza cuando el negocio agrega productos."
            />
          </Tarjeta>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {productos.map((producto) => {
              const agotado = producto.stock === 0;

              return (
                <li
                  key={producto.id}
                  className="presionable flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--sombra-baja)] hover:border-ink-300 hover:shadow-[var(--sombra-media)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-bold tracking-[-0.015em] text-ink-900">
                      {producto.nombre}
                    </h3>

                    {agotado ? (
                      <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700">
                        Agotado
                      </span>
                    ) : producto.stock < 5 ? (
                      <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        Quedan {producto.stock}
                      </span>
                    ) : null}
                  </div>

                  {producto.descripcion && (
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink-500">
                      {producto.descripcion}
                    </p>
                  )}

                  <dl className="mt-auto space-y-1 pt-4">
                    <div className="flex items-baseline justify-between">
                      <dt className="text-[12.5px] text-ink-500">Precio sin IVA</dt>
                      <dd className="numero-tabular text-[13px] font-semibold text-ink-600">
                        {formatearMoneda(producto.precioSinIva)}
                      </dd>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <dt className="text-[12.5px] text-ink-500">IVA 13%</dt>
                      <dd className="numero-tabular text-[13px] font-semibold text-ink-500">
                        {formatearMoneda(producto.iva)}
                      </dd>
                    </div>

                    <div className="flex items-baseline justify-between border-t border-line-soft pt-2">
                      <dt className="text-[12.5px] font-bold text-ink-700">
                        Precio con IVA
                      </dt>
                      <dd className="numero-tabular text-[19px] font-extrabold tracking-[-0.02em] text-brand-700">
                        {formatearMoneda(producto.precioConIva)}
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PanelShell>
  );
}
