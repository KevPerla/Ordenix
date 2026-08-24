"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

export default function RepartidorPage() {
  const { usuario } = useAuth();
  const [busqueda, setBusqueda] = useState("");

  return (
    <div className="min-h-screen bg-[#F4F8F4] text-[#172019]">
      {/* SIDEBAR */}
      <Sidebar role="repartidor" />

      {/* CONTENIDO */}
      <div className="ml-[280px] min-h-screen">
        {/* NAVBAR */}
        <Navbar title="Inicio" />

        <main className="p-6 lg:p-8">

          {/* =========================
              BIENVENIDA
          ========================== */}
          <section
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-[#DCE8DE]
              bg-gradient-to-br
              from-[#EAF7EC]
              via-white
              to-[#F5FAF5]
              p-8
              shadow-sm
              shadow-green-900/[0.04]
              lg:p-10
            "
          >
            {/* Decoración */}
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-72
                w-72
                rounded-full
                bg-green-400/10
                blur-3xl
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -bottom-20
                -left-20
                h-56
                w-56
                rounded-full
                bg-green-300/10
                blur-3xl
              "
            />

            <div className="relative">
              {/* Etiqueta */}
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-green-200
                  bg-green-50
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-green-700
                "
              >
                🚚 Ordenix
              </span>

              {/* Título */}
              <h2
                className="
                  mt-6
                  text-3xl
                  font-bold
                  tracking-tight
                  text-[#172019]
                  sm:text-4xl
                "
              >
                Hola,{" "}
                <span className="text-[#16A34A]">
                  {usuario?.nombre || "Repartidor"}
                </span>{" "}
                👋
              </h2>

              {/* Descripción */}
              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-6
                  text-[#718076]
                "
              >
                Bienvenido al panel de repartidor de Ordenix.
                Desde aquí podrás gestionar tus entregas,
                consultar pedidos y mantenerte al día con tu actividad.
              </p>

              {/* Estado */}
              <div
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-[#22C55E]
                    shadow-[0_0_10px_rgba(34,197,94,0.5)]
                  "
                />

                <span className="text-xs font-semibold text-[#15803D]">
                  Disponible para entregas
                </span>
              </div>
            </div>
          </section>

          {/* =========================
              TARJETAS
          ========================== */}
          <section className="mt-8 grid gap-5 md:grid-cols-3">

            {/* ROL */}
            <div
              className="
                group
                rounded-2xl
                border
                border-[#DCE8DE]
                bg-white
                p-6
                shadow-sm
                shadow-green-900/[0.04]
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-md
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#718076]">
                    Rol
                  </p>

                  <p className="mt-3 text-xl font-bold text-[#172019]">
                    Repartidor
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#E8F2E9]
                    text-[#166534]
                  "
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c.8-4.1 3.5-6 8-6s7.2 1.9 8 6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* DISPONIBILIDAD */}
            <div
              className="
                group
                rounded-2xl
                border
                border-[#DCE8DE]
                bg-white
                p-6
                shadow-sm
                shadow-green-900/[0.04]
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-md
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#718076]">
                    Disponibilidad
                  </p>

                  <p className="mt-3 text-xl font-bold text-[#16A34A]">
                    Disponible
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#DCFCE7]
                  "
                >
                  <span
                    className="
                      h-3
                      w-3
                      rounded-full
                      bg-[#22C55E]
                      shadow-[0_0_14px_rgba(34,197,94,0.7)]
                    "
                  />
                </div>
              </div>
            </div>

            {/* SESIÓN */}
            <div
              className="
                group
                rounded-2xl
                border
                border-[#DCE8DE]
                bg-white
                p-6
                shadow-sm
                shadow-green-900/[0.04]
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-md
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#718076]">
                    Sesión
                  </p>

                  <p className="mt-3 text-xl font-bold text-[#15803D]">
                    Activa
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#DCFCE7]
                    text-[#15803D]
                  "
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              BUSCADOR
          ========================== */}
          <section className="mt-8">
            <div
              className="
                flex
                flex-col
                gap-4
                rounded-[24px]
                border
                border-[#DCE8DE]
                bg-white
                p-4
                shadow-sm
                shadow-green-900/[0.04]
                sm:flex-row
                sm:items-center
              "
            >
              {/* INPUT */}
              <div className="relative flex-1">
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
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-4-4" />
                  </svg>
                </div>

                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar pedidos, entregas o direcciones..."
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

              {/* BOTÓN */}
              <button
                type="button"
                className="
                  flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#166534]
                  px-6
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  shadow-green-900/10
                  transition
                  hover:bg-[#15803D]
                  hover:shadow-md
                  active:scale-[0.98]
                "
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-4-4" />
                </svg>

                Buscar
              </button>
            </div>
          </section>

          {/* =========================
              ACTIVIDAD RECIENTE
          ========================== */}
          <section className="mt-8">
            <div
              className="
                overflow-hidden
                rounded-[24px]
                border
                border-[#DCE8DE]
                bg-white
                shadow-sm
                shadow-green-900/[0.04]
              "
            >
              {/* ENCABEZADO */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#E8EFE9]
                  px-6
                  py-5
                "
              >
                <div>
                  <h3 className="text-lg font-bold text-[#172019]">
                    Actividad reciente
                  </h3>

                  <p className="mt-1 text-xs text-[#8A968E]">
                    Resumen de tus entregas y actividad
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#E8F2E9]
                    text-[#15803D]
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
                    <path d="M3 12h4l3-8 4 16 3-8h4" />
                  </svg>
                </div>
              </div>

              {/* ACTIVIDADES */}
              <div className="divide-y divide-[#E8EFE9]">

                {/* ACTIVIDAD 1 */}
                <div
                  className="
                    flex
                    items-center
                    gap-4
                    p-6
                    transition
                    hover:bg-[#F7FAF7]
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#DCFCE7]
                      text-[#15803D]
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
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#172019]">
                      Repartidor disponible
                    </p>

                    <p className="mt-1 text-xs text-[#8A968E]">
                      Estás disponible para recibir nuevas entregas.
                    </p>
                  </div>

                  <span
                    className="
                      hidden
                      rounded-full
                      bg-[#DCFCE7]
                      px-3
                      py-1
                      text-[10px]
                      font-bold
                      text-[#15803D]
                      sm:block
                    "
                  >
                    DISPONIBLE
                  </span>
                </div>

                {/* ACTIVIDAD 2 */}
                <div
                  className="
                    flex
                    items-center
                    gap-4
                    p-6
                    transition
                    hover:bg-[#F7FAF7]
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#E8F2E9]
                      text-[#166534]
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
                      <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
                      <path d="M3 8v8l9 5 9-5V8" />
                      <path d="M12 13v8" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#172019]">
                      Pedidos disponibles
                    </p>

                    <p className="mt-1 text-xs text-[#8A968E]">
                      Consulta los pedidos disponibles para entrega.
                    </p>
                  </div>

                  <span
                    className="
                      hidden
                      rounded-full
                      bg-[#E8F2E9]
                      px-3
                      py-1
                      text-[10px]
                      font-bold
                      text-[#166534]
                      sm:block
                    "
                  >
                    PEDIDOS
                  </span>
                </div>

                {/* ACTIVIDAD 3 */}
                <div
                  className="
                    flex
                    items-center
                    gap-4
                    p-6
                    transition
                    hover:bg-[#F7FAF7]
                  "
                >
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#E8F2E9]
                      text-[#15803D]
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
                      <path d="M12 21s8-4.5 8-11a8 8 0 1 0-16 0c0 6.5 8 11 8 11Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#172019]">
                      Zona de entregas
                    </p>

                    <p className="mt-1 text-xs text-[#8A968E]">
                      Revisa las direcciones y rutas asignadas.
                    </p>
                  </div>

                  <span
                    className="
                      hidden
                      rounded-full
                      bg-[#E8F2E9]
                      px-3
                      py-1
                      text-[10px]
                      font-bold
                      text-[#15803D]
                      sm:block
                    "
                  >
                    RUTAS
                  </span>
                </div>

              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}