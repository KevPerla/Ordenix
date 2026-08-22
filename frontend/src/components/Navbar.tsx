"use client";

import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { usuario, cerrarSesion } = useAuth();

  const initials =
    usuario?.nombre
      ?.split(" ")
      .map((nombre) => nombre[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "US";

  return (
    <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#dfe9e0] bg-white/95 px-5 backdrop-blur-xl lg:px-10">

      {/* IZQUIERDA */}
      <div>
        <div className="flex items-center gap-3">

          <div className="h-8 w-[4px] rounded-full bg-[#16A34A]" />

          <div>
            <h1 className="text-[21px] font-bold tracking-[-0.025em] text-[#172019]">
              {title}
            </h1>

            {usuario && (
              <p className="mt-0.5 text-[11px] font-medium text-[#7A887E]">
                Gestiona tu operación desde un solo lugar
              </p>
            )}
          </div>

        </div>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-3">

        {/* NOTIFICACIONES */}
        <button
          type="button"
          className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#DFE9E0] bg-[#F4F9F4] text-[#718076] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#86EFAC] hover:bg-[#DCFCE7] hover:text-[#15803D]"
        >
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-[#16A34A] ring-2 ring-white" />
        </button>

        {/* SEPARADOR */}
        <div className="mx-1 hidden h-9 w-px bg-[#DFE9E0] sm:block" />

        {usuario ? (
          <div className="flex items-center gap-3">

            {/* INFORMACIÓN */}
            <div className="hidden text-right sm:block">
              <p className="text-[13px] font-bold text-[#172019]">
                {usuario.nombre}
              </p>

              <div className="mt-0.5 flex items-center justify-end gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#15803D]">
                  {usuario.rol}
                </p>
              </div>
            </div>

            {/* AVATAR */}
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#166534] text-[12px] font-bold text-white shadow-lg shadow-green-900/10">
                {initials}
              </div>

              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-[#22C55E]" />
            </div>

            {/* CERRAR SESIÓN */}
            <button
              type="button"
              onClick={cerrarSesion}
              title="Cerrar sesión"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl text-[#91A097] transition-all hover:bg-red-50 hover:text-red-500"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
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
  );
}