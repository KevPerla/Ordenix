"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface DialogoProps {
  titulo: string;
  descripcion?: string;
  abierto: boolean;
  onCerrar: () => void;
  children: ReactNode;
}

export default function Dialogo({
  titulo,
  descripcion,
  abierto,
  onCerrar,
  children,
}: DialogoProps) {
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;

    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") onCerrar();
    };

    document.addEventListener("keydown", alPresionar);
    contenedorRef.current?.focus();

    return () => document.removeEventListener("keydown", alPresionar);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-ink-900/50 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onCerrar}
        className="absolute inset-0 cursor-default"
        tabIndex={-1}
      />

      <div
        ref={contenedorRef}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        tabIndex={-1}
        className="aviso-entra relative max-h-[88dvh] w-full max-w-[520px] overflow-y-auto rounded-[var(--radius-panel)] border border-line bg-surface p-6 shadow-[var(--sombra-flotante)]"
      >
        <h2 className="text-[19px] font-bold tracking-[-0.02em] text-ink-900">
          {titulo}
        </h2>

        {descripcion && (
          <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
            {descripcion}
          </p>
        )}

        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
