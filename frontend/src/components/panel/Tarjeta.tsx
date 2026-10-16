import type { ReactNode } from "react";

interface TarjetaProps {
  titulo?: string;
  descripcion?: string;
  accion?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Tarjeta({
  titulo,
  descripcion,
  accion,
  children,
  className = "",
}: TarjetaProps) {
  return (
    <section
      className={`overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--sombra-baja)] ${className}`}
    >
      {titulo && (
        <header className="flex items-start justify-between gap-4 border-b border-line-soft px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-[15px] font-bold tracking-[-0.015em] text-ink-900">
              {titulo}
            </h2>

            {descripcion && (
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-500">
                {descripcion}
              </p>
            )}
          </div>

          {accion && <div className="shrink-0">{accion}</div>}
        </header>
      )}

      {children}
    </section>
  );
}
