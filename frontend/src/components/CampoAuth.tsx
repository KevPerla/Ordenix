"use client";

import { useId, useState, type ReactNode } from "react";

interface CampoAuthProps {
  nombre: string;
  etiqueta: string;
  tipo?: "text" | "email" | "tel" | "password";
  valor: string;
  onChange: (valor: string) => void;
  onBlur?: () => void;
  icono: ReactNode;
  placeholder?: string;
  error?: string;
  ayuda?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  deshabilitado?: boolean;
  autoFocus?: boolean;
  children?: ReactNode;
}

export default function CampoAuth({
  nombre,
  etiqueta,
  tipo = "text",
  valor,
  onChange,
  onBlur,
  icono,
  placeholder,
  error,
  ayuda,
  autoComplete,
  inputMode,
  deshabilitado,
  autoFocus,
  children,
}: CampoAuthProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  const esPassword = tipo === "password";
  const tipoReal = esPassword && visible ? "text" : tipo;
  const idMensaje = `${id}-msg`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-[#172019]"
      >
        {etiqueta}
      </label>

      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-4 flex text-[#8A968E]">
          {icono}
        </span>

        <input
          id={id}
          name={nombre}
          type={tipoReal}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={deshabilitado}
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || ayuda ? idMensaje : undefined}
          className={`h-12 w-full rounded-xl border bg-[#F7FAF7] pl-11 text-[15px] text-[#172019] outline-none transition placeholder:text-[#9AA79F] focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
            esPassword ? "pr-12" : "pr-4"
          } ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-[#DCE8DE] hover:border-[#B9D3C0] focus:border-[#86EFAC] focus:ring-green-100"
          }`}
        />

        {esPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={visible}
            tabIndex={deshabilitado ? -1 : 0}
            className="absolute right-1 grid h-11 w-11 place-items-center rounded-lg text-[#8A968E] transition hover:bg-[#EFF6F0] hover:text-[#172019]"
          >
            {visible ? (
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M9.9 5.8A9.6 9.6 0 0 1 12 5.5c6.3 0 9.8 6.5 9.8 6.5a17 17 0 0 1-3 3.9" />
                <path d="M6.4 7.3A16.7 16.7 0 0 0 2.2 12S5.7 18.5 12 18.5a9.3 9.3 0 0 0 4.2-1" />
                <path d="M10 10a2.8 2.8 0 0 0 4 4" />
                <path d="m3.5 3.5 17 17" />
              </svg>
            ) : (
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M2.2 12S5.7 5.5 12 5.5 21.8 12 21.8 12 18.3 18.5 12 18.5 2.2 12 2.2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {children}

      {error ? (
        <p
          id={idMensaje}
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-[12.5px] font-medium text-red-600"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mt-[2px] shrink-0"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9.2" />
            <path d="M12 7.6v5.1" />
            <circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none" />
          </svg>
          {error}
        </p>
      ) : ayuda ? (
        <p id={idMensaje} className="mt-2 text-[12.5px] text-[#718076]">
          {ayuda}
        </p>
      ) : null}
    </div>
  );
}
