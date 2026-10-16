"use client";

import Link from "next/link";
import AccesoPorRol from "@/components/AccesoPorRol";
import PanelShell from "@/components/PanelShell";
import EncabezadoPanel from "@/components/panel/EncabezadoPanel";
import EstadoVacio from "@/components/panel/EstadoVacio";
import Metrica from "@/components/panel/Metrica";
import Tarjeta from "@/components/panel/Tarjeta";
import {
  IconoBolsa,
  IconoCaja,
  IconoDinero,
  IconoGrafica,
  IconoUsuarios,
} from "@/components/panel/iconos";
import { useAuth } from "@/context/AuthContext";

const ACCESOS = [
  {
    nombre: "Productos",
    href: "/empresa/productos",
    detalle: "Catálogo, precios y existencias",
    icono: IconoCaja,
  },
  {
    nombre: "Pedidos",
    href: "/empresa/pedidos",
    detalle: "Seguimiento y cambio de estado",
    icono: IconoBolsa,
  },
  {
    nombre: "Usuarios",
    href: "/empresa/usuarios",
    detalle: "Cuentas y rol asignado",
    icono: IconoUsuarios,
  },
  {
    nombre: "Estadísticas",
    href: "/empresa/estadisticas",
    detalle: "Ventas por período",
    icono: IconoGrafica,
  },
];

export default function EmpresaPage() {
  const { usuario } = useAuth();
  const primerNombre = usuario?.nombre?.split(" ")[0];

  return (
    <PanelShell area="empresa" titulo="Dashboard">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Hola"
          nombre={primerNombre ? `Hola, ${primerNombre}` : "Panel de administración"}
          descripcion="Controlas el catálogo, el inventario y el ciclo de vida de cada pedido de la operación."
        />

        <AccesoPorRol />

        <section
          aria-label="Resumen de la operación"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <Metrica
            etiqueta="Pedidos hoy"
            valor="0"
            detalle="Aún no hay pedidos registrados"
            icono={IconoBolsa}
            tono="marca"
          />
          <Metrica
            etiqueta="En preparación"
            valor="0"
            detalle="Ninguno en cocina"
            icono={IconoCaja}
            tono="alerta"
          />
          <Metrica
            etiqueta="Productos activos"
            valor="0"
            detalle="Catálogo por construir"
            icono={IconoCaja}
            tono="neutro"
          />
          <Metrica
            etiqueta="Ventas del día"
            valor="$0.00"
            detalle="Con IVA incluido"
            icono={IconoDinero}
            tono="exito"
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Tarjeta
            titulo="Pedidos recientes"
            descripcion="Los últimos movimientos de la operación"
          >
            <EstadoVacio
              icono={IconoBolsa}
              titulo="Todavía no hay pedidos"
              descripcion="Cuando un cliente confirme su primera compra aparecerá aquí con su estado en tiempo real."
              accion={
                <Link
                  href="/empresa/productos"
                  className="presionable inline-flex h-10 items-center rounded-[var(--radius-control)] bg-brand-700 px-4 text-[13.5px] font-bold text-white shadow-[var(--sombra-baja)] hover:bg-brand-800"
                >
                  Crear el catálogo
                </Link>
              }
            />
          </Tarjeta>

          <Tarjeta
            titulo="Accesos rápidos"
            descripcion="Las áreas que administras"
          >
            <ul className="divide-y divide-line-soft">
              {ACCESOS.map((acceso) => (
                <li key={acceso.href}>
                  <Link
                    href={acceso.href}
                    className="presionable flex items-center gap-3.5 px-5 py-3.5 hover:bg-ink-50"
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-brand-50 text-brand-700"
                      aria-hidden="true"
                    >
                      {acceso.icono}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-bold text-ink-900">
                        {acceso.nombre}
                      </span>
                      <span className="block truncate text-[12px] text-ink-500">
                        {acceso.detalle}
                      </span>
                    </span>

                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-ink-300"
                      aria-hidden="true"
                    >
                      <path d="m9 6 6 6-6 6" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </Tarjeta>
        </div>
      </div>
    </PanelShell>
  );
}
