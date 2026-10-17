"use client";

import { useEffect, useState, type ReactNode } from "react";

const PASOS = [
  { estado: "Creado", hora: "18:02" },
  { estado: "Pagado", hora: "18:05" },
  { estado: "En preparación", hora: "18:07" },
  { estado: "En camino", hora: "18:24" },
  { estado: "Entregado", hora: "18:41" },
];

interface PanelMarcaProps {
  lema: ReactNode;
  entrada: string;
}

export default function PanelMarca({ lema, entrada }: PanelMarcaProps) {
  const [activo, setActivo] = useState(3);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const id = setInterval(() => {
      setActivo((n) => (n + 1) % PASOS.length);
    }, 2600);

    return () => clearInterval(id);
  }, []);

  return (
    <aside className="relative isolate hidden flex-col gap-5 overflow-hidden bg-[#0B1220] px-7 py-9 text-[#F6F8FC] lg:sticky lg:top-0 lg:flex lg:h-screen lg:self-start lg:px-10 lg:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(75%_50%_at_12%_5%,rgba(37, 99, 235,0.34),transparent_62%),radial-gradient(55%_45%_at_90%_95%,rgba(37, 99, 235,0.22),transparent_66%)]"
      />

      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] text-lg font-black text-white shadow-lg shadow-ink-900/40">
          O
        </span>
        <span className="text-[21px] font-bold tracking-[-0.02em]">
          Ordenix
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-5">
        <div>
          <h2 className="max-w-[15ch] text-[34px] font-bold leading-[1.06] tracking-[-0.03em] lg:text-[44px]">
            {lema}
          </h2>
          <p className="mt-3 max-w-[34ch] text-[14.5px] leading-snug text-[#BFDBFE]">
            {entrada}
          </p>
        </div>

        <div className="w-full max-w-[340px] rounded-[24px] border border-white/15 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[12px] tracking-[0.08em] text-[#A8B6CC]">
              ORD-2481
            </span>
            <span className="font-mono text-[15px] font-medium tabular-nums">
              $18.75
            </span>
          </div>

          <p className="mt-2.5 text-[17px] font-semibold tracking-[-0.01em]">
            Melissa Escobar
          </p>
          <p className="mt-0.5 text-[13.5px] text-[#A8B6CC]">
            3 artículos · Col. Ciudad Jardín · Efectivo
          </p>

          <ol className="mt-4 grid gap-0.5 border-t border-white/12 pt-4">
            {PASOS.map((paso, i) => {
              const hecho = i < activo;
              const esActivo = i === activo;

              return (
                <li
                  key={paso.estado}
                  aria-current={esActivo || undefined}
                  className={`flex items-center gap-2.5 py-[7px] text-[13.5px] transition-colors duration-300 ${
                    esActivo
                      ? "font-semibold text-white"
                      : hecho
                        ? "text-[#DBEAFE]"
                        : "text-[#93C5FD]"
                  }`}
                >
                  <span
                    className={`relative grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-[1.5px] transition-colors duration-300 ${
                      esActivo
                        ? "border-[#FB923C] bg-[#3B82F6]"
                        : hecho
                          ? "border-[#3B82F6] bg-[#3B82F6] text-[#0B1220]"
                          : "border-white/25"
                    }`}
                  >
                    {hecho && (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m4.5 12.5 5 5 10-11" />
                      </svg>
                    )}
                    {esActivo && (
                      <span className="absolute -inset-[5px] animate-ping rounded-full border-2 border-[#3B82F6]" />
                    )}
                  </span>

                  {paso.estado}

                  {(hecho || esActivo) && (
                    <span className="ml-auto font-mono text-[11.5px] tabular-nums opacity-75">
                      {paso.hora}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </aside>
  );
}
