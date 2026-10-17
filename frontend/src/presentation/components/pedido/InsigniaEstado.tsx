import { ETIQUETA_ESTADO, type EstadoPedido } from "@/domain/pedido";

export const TONO_ESTADO: Record<EstadoPedido, string> = {
  CREADO: "bg-ink-100 text-ink-700",
  PAGADO: "bg-brand-50 text-brand-700",
  EN_PREPARACION: "bg-amber-50 text-amber-700",
  EN_CAMINO: "bg-accent-50 text-accent-700",
  ENTREGADO: "bg-emerald-50 text-emerald-700",
  CANCELADO: "bg-red-50 text-red-700",
};

export default function InsigniaEstado({ estado }: { estado: EstadoPedido }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold ${TONO_ESTADO[estado]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {ETIQUETA_ESTADO[estado]}
    </span>
  );
}
