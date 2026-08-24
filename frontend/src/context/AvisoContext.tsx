"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type TipoAviso = "exito" | "error";

interface Aviso {
  id: number;
  mensaje: string;
  tipo: TipoAviso;
}

interface AvisoContextType {
  mostrarAviso: (mensaje: string, tipo?: TipoAviso) => void;
}

const AvisoContext = createContext<AvisoContextType | undefined>(undefined);

const DURACION_MS = 3200;

const ICONO_EXITO = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

const ICONO_ERROR = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </svg>
);

export function AvisoProvider({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const siguienteId = useRef(0);

  const mostrarAviso = useCallback(
    (mensaje: string, tipo: TipoAviso = "exito") => {
      siguienteId.current += 1;
      const id = siguienteId.current;

      setAvisos((previos) => [...previos, { id, mensaje, tipo }]);

      window.setTimeout(() => {
        setAvisos((previos) => previos.filter((aviso) => aviso.id !== id));
      }, DURACION_MS);
    },
    [],
  );

  return (
    <AvisoContext.Provider value={{ mostrarAviso }}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 top-4 z-[80] flex flex-col items-center gap-2 px-4"
      >
        {avisos.map((aviso) => (
          <div
            key={aviso.id}
            role="status"
            className="aviso-entra flex max-w-[92vw] items-center gap-2.5 rounded-full border border-[#DCE8DE] bg-white/95 py-2.5 pl-2.5 pr-4 shadow-lg shadow-green-900/10 backdrop-blur-md"
          >
            <span
              className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full text-white ${
                aviso.tipo === "exito" ? "bg-[#22C55E]" : "bg-[#DC2626]"
              }`}
            >
              {aviso.tipo === "exito" ? ICONO_EXITO : ICONO_ERROR}
            </span>

            <p className="text-[13.5px] font-semibold text-[#172019]">
              {aviso.mensaje}
            </p>
          </div>
        ))}
      </div>
    </AvisoContext.Provider>
  );
}

export function useAviso() {
  const context = useContext(AvisoContext);

  if (!context) {
    throw new Error("useAviso debe utilizarse dentro de AvisoProvider");
  }

  return context;
}
