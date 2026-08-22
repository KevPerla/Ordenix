"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "No se pudo iniciar sesión");
        return;
      }

      const usuario = data.usuario;

      if (usuario.rol === "cliente") {
        router.push("/cliente");
      } else if (usuario.rol === "empresa") {
        router.push("/empresa");
      } else if (usuario.rol === "repartidor") {
        router.push("/repartidor");
      } else {
        router.push("/");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-gradient-to-br
        from-[#DFF5E3]
        via-[#F4FAF5]
        to-[#CDEED4]
        px-4
        py-10
        text-[#172019]
      "
    >
      {/* =========================================
          DECORACIÓN DE FONDO
      ========================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-96
          w-96
          rounded-full
          bg-[#22C55E]/15
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -right-32
          h-96
          w-96
          rounded-full
          bg-[#16A34A]/15
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-72
          w-72
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/50
          blur-3xl
        "
      />

      {/* =========================================
          CONTENEDOR
      ========================================= */}

      <div className="relative w-full max-w-md">
        {/* Logo / encabezado */}

        <div className="mb-7 text-center">
          <div
            className="
              mx-auto
              mb-5
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-[#16A34A]
              to-[#15803D]
              text-2xl
              font-black
              text-white
              shadow-lg
              shadow-green-700/20
            "
          >
            O
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#172019]">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-sm text-[#718076]">
            Ingresa a tu cuenta de Ordenix
          </p>
        </div>

        {/* =========================================
            TARJETA DEL LOGIN
        ========================================= */}

        <div
          className="
            rounded-[28px]
            border
            border-[#DCE8DE]
            bg-white/95
            p-7
            shadow-xl
            shadow-green-900/[0.08]
            backdrop-blur-sm
            sm:p-8
          "
        >
          {/* Indicador */}

          <div className="mb-6 flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.45)]" />

            <span className="text-xs font-semibold uppercase tracking-wider text-[#15803D]">
              Acceso seguro
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* CORREO */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#172019]">
                Correo electrónico
              </label>

              <div className="relative">
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    flex
                    -translate-y-1/2
                    text-[#8A968E]
                  "
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </div>

                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#DCE8DE]
                    bg-[#F7FAF7]
                    pl-11
                    pr-4
                    text-sm
                    text-[#172019]
                    outline-none
                    transition
                    placeholder:text-[#9AA79F]
                    focus:border-[#86EFAC]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                />
              </div>
            </div>

            {/* CONTRASEÑA */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#172019]">
                Contraseña
              </label>

              <div className="relative">
                <div
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    flex
                    -translate-y-1/2
                    text-[#8A968E]
                  "
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#DCE8DE]
                    bg-[#F7FAF7]
                    pl-11
                    pr-4
                    text-sm
                    text-[#172019]
                    outline-none
                    transition
                    placeholder:text-[#9AA79F]
                    focus:border-[#86EFAC]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-green-100
                  "
                />
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div
                className="
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-red-600
                "
              >
                {error}
              </div>
            )}

            {/* BOTÓN */}

            <button
              type="submit"
              disabled={cargando}
              className="
                flex
                h-12
                w-full
                items-center
                justify-center
                rounded-xl
                bg-[#166534]
                text-sm
                font-bold
                text-white
                shadow-sm
                shadow-green-900/10
                transition
                hover:bg-[#15803D]
                hover:shadow-md
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          {/* REGISTRO */}

          <div className="mt-6 border-t border-[#E8EFE9] pt-6 text-center">
            <p className="text-sm text-[#718076]">
              ¿No tienes una cuenta?
            </p>

            <button
              type="button"
              onClick={() => router.push("/registro")}
              className="
                mt-2
                text-sm
                font-bold
                text-[#15803D]
                transition
                hover:text-[#166534]
              "
            >
              Regístrate
            </button>
          </div>
        </div>

        {/* Texto inferior */}

        <p className="mt-6 text-center text-xs text-[#718076]">
          © 2026 Ordenix · Gestión de pedidos y entregas
        </p>
      </div>
    </main>
  );
}