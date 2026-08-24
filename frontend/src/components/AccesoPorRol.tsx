"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getArea, type AreaResponse } from "@/lib/api";
import { AREA_POR_ROL, ETIQUETA_ROL } from "@/lib/rutas";

type Estado = "verificando" | "concedido" | "denegado";

export default function AccesoPorRol() {
  const { usuario } = useAuth();
  const [estado, setEstado] = useState<Estado>("verificando");
  const [area, setArea] = useState<AreaResponse | null>(null);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    let vigente = true;

    getArea(AREA_POR_ROL[usuario.rol])
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
      <div className="h-[54px] animate-pulse rounded-2xl bg-[#EAF3EB]" />
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
    <section className="rounded-2xl border border-[#DCE8DE] bg-white px-4 py-3 shadow-sm shadow-green-900/[0.03]">
      <div className="flex items-center gap-2">
        <span className="grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full bg-[#22C55E] text-white">
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

        <p className="text-[13px] font-semibold text-[#172019]">
          Acceso de {ETIQUETA_ROL[usuario.rol].toLowerCase()} verificado
        </p>
      </div>

      {area && area.permisos.length > 0 && (
        <p className="mt-1 pl-[25px] text-[12px] leading-relaxed text-[#8A968E]">
          {area.permisos.join(" · ")}
        </p>
      )}
    </section>
  );
}
