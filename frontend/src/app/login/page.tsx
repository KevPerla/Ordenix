"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CampoAuth from "@/presentation/components/CampoAuth";
import PanelMarca from "@/presentation/components/PanelMarca";
import { mensajeDeError } from "@/application/errores";
import { primerNombre } from "@/domain/usuario";
import { useAuth } from "@/presentation/contexto/AuthContext";
import { useAviso } from "@/presentation/contexto/AvisoContext";
import { inicioDe } from "@/presentation/navegacion/rutas";

const ICONO_CORREO = (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
    <path d="m3 7.5 8.4 5.6a2 2 0 0 0 2.2 0L21 7.5" />
  </svg>
);

const ICONO_CANDADO = (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3.5" y="10.5" width="17" height="10.5" rx="2.5" />
    <path d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
    <circle cx="12" cy="15.7" r="1.2" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { usuario, cargandoSesion, iniciarSesion } = useAuth();
  const { mostrarAviso } = useAviso();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!cargandoSesion && usuario) {
      router.replace(inicioDe(usuario.rol));
    }
  }, [cargandoSesion, usuario, router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const sesion = await iniciarSesion({ correo, password });

      mostrarAviso(`Bienvenido, ${primerNombre(sesion)}`);
      router.replace(inicioDe(sesion.rol));
    } catch (error: unknown) {
      setError(mensajeDeError(error, "No se pudo iniciar sesión"));
      setCargando(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <PanelMarca
        lema={
          <>
            Pide. Sigue.{" "}
            <span className="text-[#FB923C]">Recibe.</span>
          </>
        }
        entrada="Sigue tu pedido en tiempo real, hasta que toca tu puerta."
      />

      <main className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:min-h-0 lg:py-14">
        <div className="w-full max-w-[400px]">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] text-lg font-black text-white shadow-lg shadow-ink-900/20">
              O
            </span>
            <div>
              <p className="text-[19px] font-black tracking-[-0.04em] text-[#0F172A]">
                Ordenix
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#1D4ED8]">
                Delivery platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] text-[22px] font-black tracking-[-0.08em] text-white shadow-lg shadow-ink-900/20 lg:flex">
              O
            </span>

            <h1 className="text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-[#0F172A] sm:text-[32px]">
              Iniciar sesión
            </h1>
          </div>

          <span className="mt-3.5 block h-[3px] w-11 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8]" />

          <form onSubmit={handleLogin} className="mt-7 space-y-5" noValidate>
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-medium text-red-600"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  className="mt-[2px] shrink-0"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9.2" />
                  <path d="M12 7.6v5.1" />
                  <circle cx="12" cy="16.3" r="0.9" fill="currentColor" stroke="none" />
                </svg>
                {error}
              </div>
            )}

            <CampoAuth
              nombre="correo"
              etiqueta="Correo electrónico"
              tipo="email"
              inputMode="email"
              valor={correo}
              onChange={setCorreo}
              icono={ICONO_CORREO}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              deshabilitado={cargando}
              autoFocus
            />

            <CampoAuth
              nombre="password"
              etiqueta="Contraseña"
              tipo="password"
              valor={password}
              onChange={setPassword}
              icono={ICONO_CANDADO}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              deshabilitado={cargando}
            />

            <button
              type="submit"
              disabled={cargando}
              aria-busy={cargando || undefined}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1E40AF] text-[15px] font-bold text-white shadow-lg shadow-ink-900/15 transition-all duration-150 hover:bg-[#1D4ED8] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? (
                <>
                  <span className="h-[17px] w-[17px] animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  Entrando
                </>
              ) : (
                <>
                  Entrar
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path d="M4.5 12h15" />
                    <path d="m13.5 6 6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="mt-7 border-t border-[#EEF2F7] pt-6 text-center text-[14.5px] text-[#64748B]">
            ¿Todavía no tienes cuenta?{" "}
            <Link
              href="/registro"
              className="font-bold text-[#1D4ED8] underline-offset-4 transition hover:text-[#1E40AF] hover:underline"
            >
              Crear una
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
