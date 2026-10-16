import { IconoMas, IconoMenos } from "@/presentation/components/panel/iconos";

interface ControlCantidadProps {
  nombre: string;
  cantidad: number;
  maximo: number;
  alCambiar: (cantidad: number) => void;
}

const BOTON =
  "presionable grid h-9 w-9 place-items-center rounded-[10px] text-ink-700 hover:bg-surface hover:text-brand-700 disabled:pointer-events-none disabled:opacity-35";

export default function ControlCantidad({
  nombre,
  cantidad,
  maximo,
  alCambiar,
}: ControlCantidadProps) {
  return (
    <div
      role="group"
      aria-label={`Cantidad de ${nombre}`}
      className="inline-flex items-center rounded-[var(--radius-control)] border border-line bg-ink-50 p-0.5"
    >
      <button
        type="button"
        aria-label={`Quitar una unidad de ${nombre}`}
        onClick={() => alCambiar(cantidad - 1)}
        className={BOTON}
      >
        {IconoMenos}
      </button>

      <output
        aria-live="polite"
        className="numero-tabular w-8 text-center text-[14px] font-extrabold text-ink-900"
      >
        {cantidad}
      </output>

      <button
        type="button"
        aria-label={`Agregar una unidad de ${nombre}`}
        onClick={() => alCambiar(cantidad + 1)}
        disabled={cantidad >= maximo}
        className={BOTON}
      >
        {IconoMas}
      </button>
    </div>
  );
}
