"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CampoAuth from "@/components/CampoAuth";
import PanelMarca from "@/components/PanelMarca";
import { useAuth } from "@/context/AuthContext";
import { useAviso } from "@/context/AvisoContext";
import { login, register } from "@/lib/api";
import { inicioDe } from "@/lib/rutas";

type Campo =
  | "nombreCompleto"
  | "correo"
  | "telefono"
  | "password"
  | "confirmar";

type Formulario = Record<Campo, string>;

const VACIO: Formulario = {
  nombreCompleto: "",
  correo: "",
  telefono: "",
  password: "",
  confirmar: "",
};

const ORDEN: Campo[] = [
  "nombreCompleto",
  "correo",
  "telefono",
  "password",
  "confirmar",
];

const NIVELES = ["Muy débil", "Débil", "Aceptable", "Fuerte"];

const REQUISITOS: {
  texto: string;
  obligatorio: boolean;
  cumple: (valor: string) => boolean;
}[] = [
  {
    texto: "Al menos 8 caracteres",
    obligatorio: true,
    cumple: (valor) => valor.length >= 8,
  },
  {
    texto: "Una mayúscula y una minúscula",
    obligatorio: false,
    cumple: (valor) => /[a-z]/.test(valor) && /[A-Z]/.test(valor),
  },
  {
    texto: "Al menos un número",
    obligatorio: false,
    cumple: (valor) => /\d/.test(valor),
  },
  {
    texto: "Un símbolo, como ! ? * o #",
    obligatorio: false,
    cumple: (valor) => /[^A-Za-z0-9]/.test(valor),
  },
];

function calcularFuerza(valor: string): number {
  if (!valor) return 0;

  let puntos = 0;
  if (valor.length >= 8) puntos += 1;
  if (valor.length >= 12) puntos += 1;
  if (/[a-z]/.test(valor) && /[A-Z]/.test(valor)) puntos += 1;
  if (/\d/.test(valor)) puntos += 1;
  if (/[^A-Za-z0-9]/.test(valor)) puntos += 1;

  return Math.min(4, Math.max(1, puntos));
}

function validar(campo: Campo, valores: Formulario): string {
  const valor = valores[campo].trim();

  if (campo === "nombreCompleto") {
    if (!valor) return "Escribe tu nombre completo";
    if (valor.length < 3) return "Usa al menos 3 caracteres";
    if (valor.length > 150) return "Máximo 150 caracteres";
  }

  if (campo === "correo") {
    if (!valor) return "Escribe tu correo";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {
      return "Revisa el formato del correo";
    }
    if (valor.length > 255) return "Máximo 255 caracteres";
  }

  if (campo === "telefono") {
    if (!valor) return "Escribe tu teléfono";
    if (!/^[0-9+\-\s()]{8,30}$/.test(valor)) {
      return "Usa entre 8 y 30 dígitos";
    }
  }

  if (campo === "password") {
    if (!valores.password) return "Crea una contraseña";
    if (valores.password.length < 8) return "Mínimo 8 caracteres";
  }

  if (campo === "confirmar") {
    if (!valores.confirmar) return "Repite la contraseña";
    if (valores.confirmar !== valores.password) {
      return "Las contraseñas no coinciden";
    }
  }

  return "";
}

const ICONO_USUARIO = (
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
    <circle cx="12" cy="8" r="3.75" />
    <path d="M4.5 20.2a7.5 7.5 0 0 1 15 0" />
  </svg>
);

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

const ICONO_TELEFONO = (
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
    <rect x="6" y="2.5" width="12" height="19" rx="3" />
    <path d="M10.5 18.4h3" />
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

function Fuerza({ valor }: { valor: string }) {
  if (!valor) return null;

  const nivel = calcularFuerza(valor);
  const colores = ["bg-red-500", "bg-amber-500", "bg-lime-500", "bg-[#16A34A]"];

  return (
    <div className="mt-2.5">
      <div className="grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`h-1 rounded-full transition-colors duration-200 ${
              n <= nivel ? colores[nivel - 1] : "bg-[#E4EDE6]"
            }`}
          />
        ))}
      </div>
      <p
        aria-live="polite"
        className="mt-1.5 flex justify-between text-[12px] text-[#718076]"
      >
        <span>Seguridad de la contraseña</span>
        <span className="font-semibold text-[#172019]">
          {NIVELES[nivel - 1]}
        </span>
      </p>
    </div>
  );
}

function Requisitos({ valor }: { valor: string }) {
  return (
    <ul className="mt-3 grid gap-1.5">
      {REQUISITOS.map((requisito) => {
        const cumplido = requisito.cumple(valor);

        return (
          <li
            key={requisito.texto}
            className={`flex items-center gap-2 text-[12.5px] transition-colors ${
              cumplido ? "text-[#15803D]" : "text-[#8A968E]"
            }`}
          >
            <span
              className={`grid h-[15px] w-[15px] shrink-0 place-items-center rounded-full border transition-colors ${
                cumplido
                  ? "border-[#22C55E] bg-[#22C55E] text-white"
                  : "border-[#D3E0D6]"
              }`}
            >
              {cumplido && (
                <svg
                  width="9"
                  height="9"
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
              )}
            </span>

            <span className={cumplido ? "font-medium" : undefined}>
              {requisito.texto}
            </span>

            {!requisito.obligatorio && (
              <span className="ml-auto text-[10.5px] uppercase tracking-[0.06em] text-[#A8B4AC]">
                Recomendado
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function RegistroPage() {
  const router = useRouter();
  const { usuario, cargandoSesion, iniciarSesion } = useAuth();
  const { mostrarAviso } = useAviso();

  const [valores, setValores] = useState<Formulario>(VACIO);
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!cargandoSesion && usuario) {
      router.replace(inicioDe(usuario.rol));
    }
  }, [cargandoSesion, usuario, router]);

  const cambiar = (campo: Campo) => (valor: string) => {
    setValores((previos) => ({ ...previos, [campo]: valor }));
    if (errores[campo]) {
      setErrores((previos) => ({ ...previos, [campo]: "" }));
    }
  };

  const revisar = (campo: Campo) => () => {
    setErrores((previos) => ({ ...previos, [campo]: validar(campo, valores) }));
  };

  const handleRegistro = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const encontrados: Partial<Record<Campo, string>> = {};
    ORDEN.forEach((campo) => {
      const mensaje = validar(campo, valores);
      if (mensaje) encontrados[campo] = mensaje;
    });

    setErrores(encontrados);

    const primerFallo = ORDEN.find((campo) => encontrados[campo]);
    if (primerFallo) {
      const control = e.currentTarget.elements.namedItem(primerFallo);
      if (control instanceof HTMLInputElement) control.focus();
      return;
    }

    setCargando(true);

    try {
      await register({
        nombreCompleto: valores.nombreCompleto.trim(),
        correo: valores.correo.trim(),
        telefono: valores.telefono.trim(),
        password: valores.password,
      });

      const { accessToken, user } = await login({
        correo: valores.correo.trim(),
        password: valores.password,
      });

      iniciarSesion(user, accessToken);
      mostrarAviso("Cuenta creada exitosamente");
      router.replace(inicioDe(user.rol));
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la cuenta"
      );
      setCargando(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <PanelMarca
        lema={
          <>
            Pedir empieza{" "}
            <span className="text-[#4ADE80]">aquí.</span>
          </>
        }
        entrada="Abre tu cuenta y pide sin tarjeta. Pagas en efectivo cuando el repartidor llega."
      />

      <main className="flex items-center justify-center px-5 py-10 sm:px-8 lg:py-14">
        <div className="w-full max-w-[400px]">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#15803D] text-lg font-black text-white shadow-lg shadow-green-900/20">
              O
            </span>
            <div>
              <p className="text-[19px] font-black tracking-[-0.04em] text-[#172019]">
                Ordenix
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#15803D]">
                Delivery platform
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#DCFCE7] bg-[#F0FDF4] py-1.5 pl-2.5 pr-3.5 text-[12px] font-semibold text-[#15803D]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
            Cuenta nueva
          </span>

          <h1 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] text-[#172019]">
            Crear cuenta
          </h1>

          <p className="mt-2.5 text-[15px] leading-relaxed text-[#718076]">
            Toma menos de un minuto. Tu cuenta se crea como cliente.
          </p>

          <form onSubmit={handleRegistro} className="mt-8 space-y-5" noValidate>
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
              nombre="nombreCompleto"
              etiqueta="Nombre completo"
              valor={valores.nombreCompleto}
              onChange={cambiar("nombreCompleto")}
              onBlur={revisar("nombreCompleto")}
              error={errores.nombreCompleto}
              icono={ICONO_USUARIO}
              placeholder="Melissa Escobar"
              autoComplete="name"
              deshabilitado={cargando}
              autoFocus
            />

            <CampoAuth
              nombre="correo"
              etiqueta="Correo electrónico"
              tipo="email"
              inputMode="email"
              valor={valores.correo}
              onChange={cambiar("correo")}
              onBlur={revisar("correo")}
              error={errores.correo}
              icono={ICONO_CORREO}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              deshabilitado={cargando}
            />

            <CampoAuth
              nombre="telefono"
              etiqueta="Teléfono"
              tipo="tel"
              inputMode="tel"
              valor={valores.telefono}
              onChange={cambiar("telefono")}
              onBlur={revisar("telefono")}
              error={errores.telefono}
              icono={ICONO_TELEFONO}
              placeholder="7123-4567"
              autoComplete="tel"
              deshabilitado={cargando}
            />

            <CampoAuth
              nombre="password"
              etiqueta="Contraseña"
              tipo="password"
              valor={valores.password}
              onChange={cambiar("password")}
              onBlur={revisar("password")}
              error={errores.password}
              icono={ICONO_CANDADO}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              deshabilitado={cargando}
            >
              <Fuerza valor={valores.password} />
              <Requisitos valor={valores.password} />
            </CampoAuth>

            <CampoAuth
              nombre="confirmar"
              etiqueta="Repetir contraseña"
              tipo="password"
              valor={valores.confirmar}
              onChange={cambiar("confirmar")}
              onBlur={revisar("confirmar")}
              error={errores.confirmar}
              icono={ICONO_CANDADO}
              placeholder="Escríbela otra vez"
              autoComplete="new-password"
              deshabilitado={cargando}
            />

            <button
              type="submit"
              disabled={cargando}
              aria-busy={cargando || undefined}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#166534] text-[15px] font-bold text-white shadow-lg shadow-green-900/15 transition-all duration-150 hover:bg-[#15803D] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? (
                <>
                  <span className="h-[17px] w-[17px] animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  Creando cuenta
                </>
              ) : (
                <>
                  Crear cuenta
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

          <p className="mt-7 border-t border-[#E8EFE9] pt-6 text-center text-[14.5px] text-[#718076]">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-bold text-[#15803D] underline-offset-4 transition hover:text-[#166534] hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
