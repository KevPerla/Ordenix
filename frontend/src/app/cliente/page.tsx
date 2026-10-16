"use client";

import Link from "next/link";
import AccesoPorRol from "@/components/AccesoPorRol";
import PanelShell from "@/components/PanelShell";
import EncabezadoPanel from "@/components/panel/EncabezadoPanel";
import EstadoVacio from "@/components/panel/EstadoVacio";
import Metrica from "@/components/panel/Metrica";
import Tarjeta from "@/components/panel/Tarjeta";
import {
  IconoBolsa,
  IconoDinero,
  IconoReloj,
  IconoRuta,
} from "@/components/panel/iconos";
import { useAuth } from "@/context/AuthContext";

const PASOS = [
  {
    titulo: "Explora el catálogo",
    detalle: "Filtra por categoría y revisa precios con y sin IVA.",
  },
  {
    titulo: "Arma tu carrito",
    detalle: "Ajusta cantidades y mira el subtotal actualizarse al instante.",
  },
  {
    titulo: "Confirma el pedido",
    detalle: "Eliges dirección y el pedido entra en preparación.",
  },
  {
    titulo: "Sigue la entrega",
    detalle: "Ves cada cambio de estado hasta que toca tu puerta.",
  },
];

export default function ClientePage() {
  const { usuario } = useAuth();
  const primerNombre = usuario?.nombre?.split(" ")[0];

  return (
    <PanelShell area="cliente" titulo="Inicio">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Hola"
          nombre={primerNombre ? `Hola, ${primerNombre}` : "Bienvenido"}
          descripcion="Pide de tus lugares favoritos y sigue cada pedido hasta que llegue a tu puerta."
          accion={
            <Link
              href="/cliente/menu"
              className="presionable inline-flex h-11 items-center gap-2 rounded-[var(--radius-control)] bg-accent-600 px-5 text-[14px] font-bold text-white shadow-[var(--sombra-media)] hover:bg-accent-700"
            >
              Ver catálogo
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </Link>
          }
        />

        <AccesoPorRol />

        <section
          aria-label="Resumen de tu actividad"
          className="grid gap-4 sm:grid-cols-3"
        >
          <Metrica
            etiqueta="Pedidos activos"
            valor="0"
            detalle="Nada en camino ahora mismo"
            icono={IconoRuta}
            tono="marca"
          />
          <Metrica
            etiqueta="Pedidos totales"
            valor="0"
            detalle="Tu historial empieza con el primero"
            icono={IconoBolsa}
            tono="neutro"
          />
          <Metrica
            etiqueta="Gasto acumulado"
            valor="$0.00"
            detalle="IVA incluido"
            icono={IconoDinero}
            tono="exito"
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Tarjeta
            titulo="Tus pedidos"
            descripcion="El estado de lo que has pedido"
          >
            <EstadoVacio
              icono={IconoReloj}
              titulo="Todavía no has pedido nada"
              descripcion="Cuando hagas tu primer pedido vas a poder seguirlo aquí paso a paso, desde que entra en preparación hasta que te lo entregan."
              accion={
                <Link
                  href="/cliente/menu"
                  className="presionable inline-flex h-10 items-center rounded-[var(--radius-control)] bg-brand-700 px-4 text-[13.5px] font-bold text-white shadow-[var(--sombra-baja)] hover:bg-brand-800"
                >
                  Explorar el catálogo
                </Link>
              }
            />
          </Tarjeta>

          <Tarjeta titulo="Cómo funciona" descripcion="Cuatro pasos y listo">
            <ol className="divide-y divide-line-soft">
              {PASOS.map((paso, indice) => (
                <li key={paso.titulo} className="flex gap-3.5 px-5 py-3.5">
                  <span className="numero-tabular grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-[12px] font-bold text-brand-700">
                    {indice + 1}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-bold text-ink-900">
                      {paso.titulo}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-500">
                      {paso.detalle}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Tarjeta>
        </div>
      </div>
    </PanelShell>
  );
}
