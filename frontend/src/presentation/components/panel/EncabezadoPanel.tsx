"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { formatearFechaCorta, formatearHora } from "@/presentation/formato/fechas";

const INTERVALO_MS = 30_000;

function suscribir(alCambiar: () => void) {
  const id = window.setInterval(alCambiar, INTERVALO_MS);
  return () => window.clearInterval(id);
}

function marcaCliente(): number {
  return Math.floor(Date.now() / INTERVALO_MS);
}

function marcaServidor(): number {
  return 0;
}

interface EncabezadoPanelProps {
  saludo: string;
  nombre?: string;
  descripcion: string;
  accion?: ReactNode;
}

function saludoSegunHora(fecha: Date): string {
  const hora = Number(
    new Intl.DateTimeFormat("es-SV", {
      timeZone: "America/El_Salvador",
      hour: "numeric",
      hour12: false,
    }).format(fecha),
  );

  if (hora < 12) return "Buenos días";
  if (hora < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default function EncabezadoPanel({
  saludo,
  nombre,
  descripcion,
  accion,
}: EncabezadoPanelProps) {
  const marca = useSyncExternalStore(suscribir, marcaCliente, marcaServidor);
  const ahora = marca > 0 ? new Date(marca * INTERVALO_MS) : null;

  return (
    <header className="surge flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-brand-700">
          {ahora ? saludoSegunHora(ahora) : saludo}
        </p>

        <h1 className="titulo-grande mt-1.5 text-[26px] font-extrabold text-ink-900 sm:text-[30px]">
          {nombre ?? "Bienvenido"}
        </h1>

        <p className="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-ink-500">
          {descripcion}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-3">
        <div className="rounded-[var(--radius-control)] border border-line bg-surface px-3.5 py-2 shadow-[var(--sombra-baja)] sm:text-right">
          <p className="numero-tabular whitespace-nowrap text-[13px] font-bold text-ink-900 first-letter:uppercase">
            {ahora ? formatearFechaCorta(ahora) : "—"}
          </p>
          <p className="numero-tabular mt-0.5 whitespace-nowrap text-[11.5px] font-medium text-ink-500">
            {ahora ? `${formatearHora(ahora)} · El Salvador` : "El Salvador"}
          </p>
        </div>

        {accion}
      </div>
    </header>
  );
}
