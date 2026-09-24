"use client";

import Link from "next/link";
import AccesoPorRol from "@/components/AccesoPorRol";
import PanelShell from "@/components/PanelShell";
import EncabezadoPanel from "@/components/panel/EncabezadoPanel";
import EstadoVacio from "@/components/panel/EstadoVacio";
import Metrica from "@/components/panel/Metrica";
import Tarjeta from "@/components/panel/Tarjeta";
import {
  IconoDinero,
  IconoEstrella,
  IconoMoto,
  IconoReloj,
  IconoRuta,
} from "@/components/panel/iconos";
import { useAuth } from "@/context/AuthContext";

const TURNO = [
  {
    titulo: "Toma una entrega",
    detalle: "Las disponibles de tu zona aparecen en la lista.",
  },
  {
    titulo: "Marca el avance",
    detalle: "Cambia el estado a en camino cuando salgas del local.",
  },
  {
    titulo: "Confirma la entrega",
    detalle: "El cliente ve el cambio en el momento en que lo marcas.",
  },
  {
    titulo: "Liquida el efectivo",
    detalle: "Al cerrar turno cuadras lo cobrado con lo entregado.",
  },
];

export default function RepartidorPage() {
  const { usuario } = useAuth();
  const primerNombre = usuario?.nombre?.split(" ")[0];

  return (
    <PanelShell area="repartidor" titulo="Inicio">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Hola"
          nombre={primerNombre ? `Hola, ${primerNombre}` : "Panel de reparto"}
          descripcion="Tomas las entregas de tu zona, marcas cada avance y cierras el turno con el efectivo cuadrado."
          accion={
            <Link
              href="/repartidor/disponibles"
              className="presionable inline-flex h-11 items-center gap-2 rounded-[var(--radius-control)] bg-brand-700 px-5 text-[14px] font-bold text-white shadow-[var(--sombra-media)] hover:bg-brand-800"
            >
              Ver disponibles
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
          aria-label="Resumen del turno"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <Metrica
            etiqueta="En curso"
            valor="0"
            detalle="Ninguna entrega asignada"
            icono={IconoMoto}
            tono="marca"
          />
          <Metrica
            etiqueta="Entregadas hoy"
            valor="0"
            detalle="El turno acaba de empezar"
            icono={IconoRuta}
            tono="exito"
          />
          <Metrica
            etiqueta="Por liquidar"
            valor="$0.00"
            detalle="Efectivo cobrado pendiente"
            icono={IconoDinero}
            tono="alerta"
          />
          <Metrica
            etiqueta="Calificación"
            valor="—"
            detalle="Sin entregas calificadas"
            icono={IconoEstrella}
            tono="neutro"
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Tarjeta
            titulo="Entregas asignadas"
            descripcion="Lo que tienes en ruta ahora"
          >
            <EstadoVacio
              icono={IconoReloj}
              titulo="No tienes entregas asignadas"
              descripcion="Cuando tomes una entrega disponible vas a ver aquí la dirección, el detalle del pedido y el monto a cobrar."
              accion={
                <Link
                  href="/repartidor/disponibles"
                  className="presionable inline-flex h-10 items-center rounded-[var(--radius-control)] bg-brand-700 px-4 text-[13.5px] font-bold text-white shadow-[var(--sombra-baja)] hover:bg-brand-800"
                >
                  Buscar entregas
                </Link>
              }
            />
          </Tarjeta>

          <Tarjeta titulo="Tu turno" descripcion="El flujo de cada entrega">
            <ol className="divide-y divide-line-soft">
              {TURNO.map((paso, indice) => (
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
