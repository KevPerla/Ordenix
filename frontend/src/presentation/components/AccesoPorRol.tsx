"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/presentation/contexto/AuthContext";
import type { AreaDeRol } from "@/domain/usuario";
import { autenticacion } from "@/infrastructure/contenedor";
import { ETIQUETA_ROL } from "@/presentation/navegacion/rutas";

type Estado = "verificando" | "concedido" | "denegado";

export default function AccesoPorRol() {
  const { usuario } = useAuth();
  const [estado, setEstado] = useState<Estado>("verificando");
  const [area, setArea] = useState<AreaDeRol | null>(null);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    let vigente = true;

    autenticacion
      .verificarArea(usuario)
      .then((respuesta) => {
        if (!vigente) return;
        setArea(respuesta);
        setEstado("concedido");
      })
      .catch(() => {
        if (!vigente) return;
        setEstado("denegado");
      });

    return () => {
      vigente = false;
    };
  }, [usuario]);

  if (!usuario) {
    return null;
  }

  if (estado === "verificando") {
    return (
      <div className="h-[54px] animate-pulse rounded-2xl bg-[#EEF2F7]" />
    );
  }

  if (estado === "denegado") {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13.5px] font-medium text-amber-700"
      >
        No pudimos confirmar los permisos de tu sesión. Vuelve a iniciar sesión.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-sm shadow-ink-900/[0.03]">
      <div className="flex items-center gap-2">
        <span className="grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full bg-[#3B82F6] text-white">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m4.5 12.5 5 5 10-11" />
          </svg>
        </span>

        <p className="text-[13px] font-semibold text-[#0F172A]">
          Acceso de {ETIQUETA_ROL[usuario.rol].toLowerCase()} verificado
        </p>
      </div>

      {area && area.permisos.length > 0 && (
        <p className="mt-1 pl-[25px] text-[12px] leading-relaxed text-[#94A3B8]">
          {area.permisos.join(" · ")}
        </p>
      )}
    </section>
  );
}
