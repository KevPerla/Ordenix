"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useAviso } from "@/context/AvisoContext";

interface NavbarProps {
  title: string;
  onAbrirMenu?: () => void;
}

export default function Navbar({ title, onAbrirMenu }: NavbarProps) {
  const router = useRouter();
  const { usuario, cerrarSesion } = useAuth();
  const { mostrarAviso } = useAviso();
  const [confirmando, setConfirmando] = useState(false);
  const cancelarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!confirmando) {
      return;
    }

    cancelarRef.current?.focus();

    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setConfirmando(false);
      }
    };

    document.addEventListener("keydown", alPresionar);

    return () => {
      document.removeEventListener("keydown", alPresionar);
    };
  }, [confirmando]);

  function confirmarSalida() {
    cerrarSesion();
    mostrarAviso("Sesión cerrada exitosamente");
    router.replace("/login");
  }

  const initials =
    usuario?.nombre
      ?.split(" ")
      .map((nombre) => nombre[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "US";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between gap-3 border-b border-[#dfe9e0] bg-white/95 px-4 backdrop-blur-xl sm:h-[78px] sm:px-5 lg:px-10">

        <div className="flex min-w-0 items-center gap-3">

          <button
            type="button"
            onClick={onAbrirMenu}
            aria-label="Abrir menú"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DFE9E0] bg-[#F4F9F4] text-[#3F4F44] transition hover:border-[#86EFAC] hover:bg-[#DCFCE7] hover:text-[#15803D] lg:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>

          <div className="hidden h-8 w-[4px] shrink-0 rounded-full bg-[#16A34A] sm:block" />

          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-bold tracking-[-0.025em] text-[#172019] sm:text-[21px]">
              {title}
            </h1>

            {usuario && (
              <p className="mt-0.5 hidden text-[11px] font-medium text-[#7A887E] sm:block">
                Gestiona tu operación desde un solo lugar
              </p>
            )}
          </div>

        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          <button
            type="button"
            aria-label="Notificaciones"
            className="relative hidden h-11 w-11 items-center justify-center rounded-2xl border border-[#DFE9E0] bg-[#F4F9F4] text-[#718076] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#86EFAC] hover:bg-[#DCFCE7] hover:text-[#15803D] sm:flex"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#16A34A] ring-2 ring-white" />
          </button>

          <div className="mx-1 hidden h-9 w-px bg-[#DFE9E0] sm:block" />

          {usuario ? (
            <div className="flex items-center gap-2 sm:gap-3">

              <div className="hidden min-w-0 text-right sm:block">
                <p className="truncate text-[13px] font-bold text-[#172019]">
                  {usuario.nombre}
                </p>

                <div className="mt-0.5 flex items-center justify-end gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#15803D]">
                    {usuario.rol}
                  </p>
                </div>
              </div>

              <div className="relative shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#166534] text-[12px] font-bold text-white shadow-lg shadow-green-900/10 sm:h-11 sm:w-11 sm:rounded-[15px]">
                  {initials}
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-[#22C55E]" />
              </div>

              <button
                type="button"
                onClick={() => setConfirmando(true)}
                aria-label="Cerrar sesión"
                title="Cerrar sesión"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#91A097] transition-all hover:bg-red-50 hover:text-red-500"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                  <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
                </svg>
              </button>

            </div>
          ) : (
            <div className="text-sm font-medium text-[#91A097]">
              Invitado
            </div>
          )}

        </div>
      </header>

      {confirmando && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#0E2417]/50 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0">
          <div
            aria-hidden="true"
            onClick={() => setConfirmando(false)}
            className="absolute inset-0"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-cerrar-sesion"
            className="relative w-full max-w-[400px] rounded-[26px] border border-[#DCE8DE] bg-white p-6 shadow-2xl sm:p-7"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
              </svg>
            </span>

            <h2
              id="titulo-cerrar-sesion"
              className="mt-4 text-[21px] font-bold tracking-[-0.02em] text-[#172019]"
            >
              ¿Cerrar sesión?
            </h2>

            <p className="mt-2 text-[14.5px] leading-relaxed text-[#6B7A6F]">
              Vas a salir de tu cuenta. Tendrás que escribir tu correo y
              contraseña para volver a entrar.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row">
              <button
                ref={cancelarRef}
                type="button"
                onClick={() => setConfirmando(false)}
                className="h-12 flex-1 rounded-xl border border-[#DCE8DE] bg-white text-[15px] font-semibold text-[#3F4F44] transition hover:border-[#B9D3C0] hover:bg-[#F7FAF7] focus:outline-none focus:ring-4 focus:ring-green-100 active:scale-[0.98]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarSalida}
                className="h-12 flex-1 rounded-xl bg-[#DC2626] text-[15px] font-bold text-white shadow-lg shadow-red-900/15 transition hover:bg-[#B91C1C] focus:outline-none focus:ring-4 focus:ring-red-100 active:scale-[0.98]"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
