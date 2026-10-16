"use client";

import Link from "next/link";
import { useState } from "react";
import { cantidadEnCarrito } from "@/domain/carrito";
import { estaAgotado, quedanPocas, type Producto } from "@/domain/catalogo";
import { catalogo } from "@/infrastructure/contenedor";
import ControlCantidad from "@/presentation/components/carrito/ControlCantidad";
import PanelShell from "@/presentation/components/PanelShell";
import EncabezadoPanel from "@/presentation/components/panel/EncabezadoPanel";
import EstadoVacio from "@/presentation/components/panel/EstadoVacio";
import Tarjeta from "@/presentation/components/panel/Tarjeta";
import { BOTON_ACENTO, BOTON_PRIMARIO } from "@/presentation/components/panel/estilos";
import { IconoCaja, IconoFlecha, IconoMas } from "@/presentation/components/panel/iconos";
import { formatearMoneda } from "@/presentation/formato/moneda";
import { useCarrito } from "@/presentation/hooks/useCarrito";
import { useConsulta } from "@/presentation/hooks/useConsulta";

const TODAS = "";
const REFRESCO_MS = 5_000;

function Precios({ producto }: { producto: Producto }) {
  return (
    <dl className="space-y-1">
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
        <dt className="text-[12.5px] font-bold text-ink-700">Precio con IVA</dt>
        <dd className="numero-tabular text-[19px] font-extrabold tracking-[-0.02em] text-brand-700">
          {formatearMoneda(producto.precioConIva)}
        </dd>
      </div>
    </dl>
  );
}

export default function ClienteMenuPage() {
  const [categoriaActiva, setCategoriaActiva] = useState(TODAS);
  const carrito = useCarrito();

  const categorias = useConsulta(() => catalogo.categorias(), [], {
    refrescarCadaMs: REFRESCO_MS,
  });
  const productos = useConsulta(
    () => catalogo.catalogoDelCliente(categoriaActiva),
    [categoriaActiva],
    { refrescarCadaMs: REFRESCO_MS, respaldo: "No se pudo cargar el catálogo" },
  );

  const filtros = [{ id: TODAS, nombre: "Todo" }, ...(categorias.datos ?? [])];
  const lista = productos.datos ?? [];

  return (
    <PanelShell area="cliente" titulo="Catálogo">
      <div className="space-y-6 pb-24">
        <EncabezadoPanel
          saludo="Catálogo"
          nombre="Qué vas a pedir"
          descripcion="Cada producto muestra su precio sin IVA y con el 13% aplicado. Pagas en efectivo al recibir."
        />

        <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
          {filtros.map((filtro) => {
            const activo = filtro.id === categoriaActiva;

            return (
              <button
                key={filtro.id || "todo"}
                type="button"
                aria-pressed={activo}
                onClick={() => setCategoriaActiva(filtro.id)}
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

        {productos.cargando ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((tarjeta) => (
              <div key={tarjeta} className="esqueleto h-[232px] rounded-[var(--radius-card)]" />
            ))}
          </div>
        ) : productos.error && lista.length === 0 ? (
          <Tarjeta titulo="No se pudo cargar el catálogo">
            <div role="alert" className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
              <p className="text-[13.5px] text-red-600">{productos.error}</p>
              <button type="button" onClick={productos.recargar} className={BOTON_PRIMARIO}>
                Reintentar
              </button>
            </div>
          </Tarjeta>
        ) : lista.length === 0 ? (
          <Tarjeta titulo="Catálogo vacío">
            <EstadoVacio
              icono={IconoCaja}
              titulo="No hay productos en esta categoría"
              descripcion="Prueba con otra categoría. El catálogo se actualiza en cuanto el negocio agrega productos."
            />
          </Tarjeta>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {lista.map((producto) => {
              const enCarrito = cantidadEnCarrito(carrito.lineas, producto.id);
              const agotado = estaAgotado(producto);

              return (
                <li
                  key={producto.id}
                  className={`flex flex-col rounded-[var(--radius-card)] border bg-surface p-5 shadow-[var(--sombra-baja)] transition-colors duration-200 ${
                    enCarrito > 0 ? "border-brand-300" : "border-line"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-bold tracking-[-0.015em] text-ink-900">
                      {producto.nombre}
                    </h3>

                    {agotado ? (
                      <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700">
                        Agotado
                      </span>
                    ) : quedanPocas(producto) ? (
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

                  <div className="mt-auto pt-4">
                    <Precios producto={producto} />

                    <div className="mt-4 flex h-11 items-center justify-end">
                      {enCarrito > 0 ? (
                        <ControlCantidad
                          nombre={producto.nombre}
                          cantidad={enCarrito}
                          maximo={producto.stock}
                          alCambiar={(cantidad) =>
                            carrito.cambiarCantidad(producto.id, cantidad)
                          }
                        />
                      ) : (
                        <button
                          type="button"
                          disabled={agotado}
                          onClick={() => carrito.agregar(producto)}
                          className={`${BOTON_PRIMARIO} w-full`}
                        >
                          {IconoMas}
                          {agotado ? "Sin existencias" : "Agregar al carrito"}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {carrito.resumen.unidades > 0 && (
        <div className="surge fixed inset-x-4 bottom-4 z-30 lg:left-[calc(280px+2rem)] lg:right-8">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-[var(--radius-panel)] border border-line bg-surface/95 py-3 pl-5 pr-3 shadow-[var(--sombra-flotante)] backdrop-blur-md">
            <p className="min-w-0 text-[13px] text-ink-600">
              <span className="numero-tabular font-extrabold text-ink-900">
                {carrito.resumen.unidades}
              </span>{" "}
              {carrito.resumen.unidades === 1 ? "producto" : "productos"} ·{" "}
              <span className="numero-tabular font-extrabold text-ink-900">
                {formatearMoneda(carrito.resumen.total)}
              </span>{" "}
              con IVA
            </p>

            <Link href="/cliente/carrito" className={BOTON_ACENTO}>
              Ver carrito
              {IconoFlecha}
            </Link>
          </div>
        </div>
      )}
    </PanelShell>
  );
}
