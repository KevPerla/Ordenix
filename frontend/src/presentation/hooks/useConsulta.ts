"use client";

import { useCallback, useEffect, useEffectEvent, useState } from "react";
import { mensajeDeError } from "@/application/errores";

interface Resultado<T> {
  clave: string;
  datos: T | undefined;
  error: string | null;
}

interface OpcionesConsulta {
  refrescarCadaMs?: number;
  respaldo?: string;
}

export interface Consulta<T> {
  datos: T | undefined;
  error: string | null;
  cargando: boolean;
  recargar: () => void;
}

export function useConsulta<T>(
  cargar: () => Promise<T>,
  dependencias: readonly unknown[],
  { refrescarCadaMs, respaldo = "No se pudo cargar la información" }: OpcionesConsulta = {},
): Consulta<T> {
  const clave = JSON.stringify(dependencias);
  const [version, setVersion] = useState(0);
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);

  const ejecutar = useEffectEvent(() => cargar());
  const mensajeRespaldo = useEffectEvent(() => respaldo);

  const recargar = useCallback(() => setVersion((actual) => actual + 1), []);

  useEffect(() => {
    let vigente = true;

    ejecutar().then(
      (datos) => {
        if (vigente) setResultado({ clave, datos, error: null });
      },
      (error: unknown) => {
        if (!vigente) return;
        setResultado((previo) => ({
          clave,
          datos: previo?.clave === clave ? previo.datos : undefined,
          error: mensajeDeError(error, mensajeRespaldo()),
        }));
      },
    );

    return () => {
      vigente = false;
    };
  }, [clave, version]);

  useEffect(() => {
    const alVolver = () => {
      if (document.visibilityState === "visible") recargar();
    };

    document.addEventListener("visibilitychange", alVolver);
    const intervalo = refrescarCadaMs
      ? window.setInterval(recargar, refrescarCadaMs)
      : undefined;

    return () => {
      document.removeEventListener("visibilitychange", alVolver);
      window.clearInterval(intervalo);
    };
  }, [recargar, refrescarCadaMs]);

  const vigente = resultado?.clave === clave ? resultado : null;

  return {
    datos: vigente?.datos,
    error: vigente?.error ?? null,
    cargando: vigente === null,
    recargar,
  };
}
