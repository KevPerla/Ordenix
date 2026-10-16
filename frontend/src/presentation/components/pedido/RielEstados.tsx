import type { CSSProperties } from "react";
import {
  ETIQUETA_ESTADO,
  RECORRIDO,
  fechaDelEstado,
  type EstadoPedido,
  type Pedido,
} from "@/domain/pedido";
import { formatearHora } from "@/presentation/formato/fechas";

type Situacion = "hecho" | "actual" | "pendiente" | "cancelado";

function pasosDe(pedido: Pedido): EstadoPedido[] {
  if (pedido.estado !== "CANCELADO") {
    return [...RECORRIDO];
  }

  const alcanzados = RECORRIDO.filter((estado) => fechaDelEstado(pedido, estado));
  return [...alcanzados, "CANCELADO"];
}

function situacionDe(indice: number, actual: number, estado: EstadoPedido): Situacion {
  if (estado === "CANCELADO") return "cancelado";
  if (indice < actual || (indice === actual && estado === "ENTREGADO")) return "hecho";
  if (indice === actual) return "actual";
  return "pendiente";
}

const NODO: Record<Situacion, string> = {
  hecho: "border-brand-700 bg-brand-700 text-white",
  actual: "border-accent-500 bg-surface text-accent-600 ring-4 ring-accent-100",
  pendiente: "border-ink-200 bg-surface text-transparent",
  cancelado: "border-red-600 bg-red-600 text-white",
};

const ETIQUETA: Record<Situacion, string> = {
  hecho: "text-ink-900",
  actual: "text-ink-900",
  pendiente: "text-ink-400",
  cancelado: "text-red-700",
};

function Marca({ situacion }: { situacion: Situacion }) {
  if (situacion === "actual") {
    return <span className="h-2 w-2 rounded-full bg-current" />;
  }

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {situacion === "cancelado" ? (
        <path d="M6 6l12 12M18 6 6 18" />
      ) : (
        <path d="m4.5 12.5 5 5 10-11" />
      )}
    </svg>
  );
}

export default function RielEstados({ pedido }: { pedido: Pedido }) {
  const pasos = pasosDe(pedido);
  const actual = pasos.indexOf(pedido.estado);
  const progreso = pasos.length > 1 ? actual / (pasos.length - 1) : 0;

  return (
    <ol
      aria-label="Recorrido del pedido"
      style={{ "--pasos": pasos.length } as CSSProperties}
      className="relative grid gap-4 sm:grid-cols-[repeat(var(--pasos),minmax(0,1fr))] sm:gap-0"
    >
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-[11px] top-3 w-[2px] bg-line sm:hidden"
      />

      <span
        aria-hidden="true"
        className="absolute top-[11px] hidden h-[2px] bg-line sm:block"
        style={{
          left: `calc(100% / ${pasos.length * 2})`,
          right: `calc(100% / ${pasos.length * 2})`,
        }}
      >
        <span
          className={`absolute inset-0 origin-left transition-transform duration-[var(--duracion-media)] ease-[var(--curva-salida)] ${
            pedido.estado === "CANCELADO" ? "bg-red-300" : "bg-brand-700"
          }`}
          style={{ transform: `scaleX(${progreso})` }}
        />
      </span>

      {pasos.map((estado, indice) => {
        const situacion = situacionDe(indice, actual, estado);
        const fecha = fechaDelEstado(pedido, estado);

        return (
          <li
            key={estado}
            aria-current={indice === actual ? "step" : undefined}
            className="relative flex items-center gap-3 sm:flex-col sm:gap-2 sm:text-center"
          >
            <span
              className={`relative grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-[var(--duracion-media)] ${NODO[situacion]}`}
            >
              {situacion !== "pendiente" && <Marca situacion={situacion} />}
            </span>

            <span className="min-w-0">
              <span
                className={`block text-[12.5px] font-bold leading-tight ${ETIQUETA[situacion]}`}
              >
                {ETIQUETA_ESTADO[estado]}
              </span>
              <span className="numero-tabular mt-0.5 block text-[11.5px] text-ink-500">
                {fecha ? formatearHora(fecha) : "Pendiente"}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
