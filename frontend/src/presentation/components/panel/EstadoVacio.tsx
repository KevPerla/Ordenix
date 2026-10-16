import type { ReactNode } from "react";

interface EstadoVacioProps {
  icono: ReactNode;
  titulo: string;
  descripcion: string;
  accion?: ReactNode;
}

export default function EstadoVacio({
  icono,
  titulo,
  descripcion,
  accion,
}: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span
        className="grid h-12 w-12 place-items-center rounded-2xl bg-ink-100 text-ink-400"
        aria-hidden="true"
      >
        {icono}
      </span>

      <p className="mt-4 text-[14.5px] font-bold text-ink-900">{titulo}</p>

      <p className="mt-1 max-w-[42ch] text-[13px] leading-relaxed text-ink-500">
        {descripcion}
      </p>

      {accion && <div className="mt-5">{accion}</div>}
    </div>
  );
}
