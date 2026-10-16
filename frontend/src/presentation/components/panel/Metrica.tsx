import type { ReactNode } from "react";

type Tono = "neutro" | "marca" | "acento" | "exito" | "alerta";

const TONOS: Record<Tono, string> = {
  neutro: "bg-ink-100 text-ink-600",
  marca: "bg-brand-50 text-brand-700",
  acento: "bg-accent-50 text-accent-700",
  exito: "bg-emerald-50 text-emerald-700",
  alerta: "bg-amber-50 text-amber-700",
};

interface MetricaProps {
  etiqueta: string;
  valor: string | number;
  unidad?: string;
  detalle?: string;
  icono: ReactNode;
  tono?: Tono;
}

export default function Metrica({
  etiqueta,
  valor,
  unidad,
  detalle,
  icono,
  tono = "neutro",
}: MetricaProps) {
  return (
    <article className="presionable rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-[var(--sombra-baja)] sm:p-5 hover:border-ink-300 hover:shadow-[var(--sombra-media)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink-500">
          {etiqueta}
        </p>

        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] ${TONOS[tono]}`}
          aria-hidden="true"
        >
          {icono}
        </span>
      </div>

      <p className="numero-tabular mt-2.5 flex items-baseline gap-1 text-[26px] font-bold leading-none tracking-[-0.03em] text-ink-900 sm:mt-3 sm:text-[28px]">
        {valor}
        {unidad && (
          <span className="text-[15px] font-semibold text-ink-400">
            {unidad}
          </span>
        )}
      </p>

      {detalle && (
        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">
          {detalle}
        </p>
      )}
    </article>
  );
}
