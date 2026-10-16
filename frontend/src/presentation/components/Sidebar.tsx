"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  IconoBolsa,
  IconoCaja,
  IconoCarrito,
  IconoInicio,
  IconoMoto,
  IconoPerfil,
  IconoTablero,
  IconoUsuarios,
} from "@/presentation/components/panel/iconos";
import { useCarrito } from "@/presentation/hooks/useCarrito";

export type Area = "cliente" | "empresa" | "repartidor";

interface ItemMenu {
  nombre: string;
  href: string;
  descripcion: string;
  icono: ReactNode;
  contador?: "carrito";
}

const MENUS: Record<Area, ItemMenu[]> = {
  cliente: [
    { nombre: "Inicio", href: "/cliente", descripcion: "Resumen general", icono: IconoInicio },
    { nombre: "Catálogo", href: "/cliente/menu", descripcion: "Productos disponibles", icono: IconoCaja },
    { nombre: "Carrito", href: "/cliente/carrito", descripcion: "Revisa y confirma", icono: IconoCarrito, contador: "carrito" },
    { nombre: "Mis pedidos", href: "/cliente/pedidos", descripcion: "Estado de cada orden", icono: IconoBolsa },
    { nombre: "Perfil", href: "/cliente/perfil", descripcion: "Tu información", icono: IconoPerfil },
  ],
  empresa: [
    { nombre: "Dashboard", href: "/empresa", descripcion: "Vista general", icono: IconoTablero },
    { nombre: "Productos", href: "/empresa/productos", descripcion: "Catálogo e inventario", icono: IconoCaja },
    { nombre: "Pedidos", href: "/empresa/pedidos", descripcion: "Seguimiento y estados", icono: IconoBolsa },
    { nombre: "Usuarios", href: "/empresa/usuarios", descripcion: "Gestionar equipo", icono: IconoUsuarios },
  ],
  repartidor: [
    { nombre: "Inicio", href: "/repartidor", descripcion: "Resumen general", icono: IconoInicio },
    { nombre: "Entregas", href: "/repartidor/pedidos", descripcion: "Disponibles y en ruta", icono: IconoMoto },
  ],
};

const INICIO: Record<Area, string> = {
  cliente: "/cliente",
  empresa: "/empresa",
  repartidor: "/repartidor",
};

interface SidebarProps {
  role: Area;
  abierto: boolean;
  onCerrar: () => void;
}

export default function Sidebar({ role, abierto, onCerrar }: SidebarProps) {
  const pathname = usePathname();
  const { resumen } = useCarrito();
  const inicio = INICIO[role];

  return (
    <>
      {abierto && (
        <div
          onClick={onCerrar}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-[#0B1220]/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col overflow-y-auto overflow-x-hidden border-r border-line bg-gradient-to-b from-ink-100 via-canvas to-white transition-transform duration-300 ease-[var(--curva-salida)] lg:translate-x-0 ${
          abierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute -left-24 -top-24 h-[280px] w-[280px] rounded-full bg-brand-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-[35%] h-[220px] w-[220px] rounded-full bg-brand-300/10 blur-3xl" />

        <div className="relative px-7 pb-7 pt-8">
          <Link href={inicio} onClick={onCerrar} className="group flex items-center gap-3.5">
            <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-[17px] bg-brand-800 shadow-xl shadow-ink-900/10 transition-transform duration-300 group-hover:-translate-y-0.5">
              <span className="absolute -right-3 -top-3 h-9 w-9 rounded-full bg-brand-300/30 blur-md" />
              <span className="absolute bottom-0 left-0 h-1 w-full bg-accent-400" />
              <span className="relative text-[22px] font-black tracking-[-0.08em] text-white">
                O
              </span>
            </span>

            <span>
              <span className="block text-[21px] font-black tracking-[-0.05em] text-ink-900">
                Ordenix
              </span>
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.24em] text-brand-700">
                Delivery platform
              </span>
            </span>
          </Link>
        </div>

        <nav className="relative mt-9 flex-1 px-5" aria-label="Navegación principal">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-500">
            Navegación
          </p>

          <ul className="space-y-1.5">
            {MENUS[role].map((item) => {
              const activo =
                item.href === inicio
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
              const cantidad = item.contador === "carrito" ? resumen.unidades : 0;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onCerrar}
                    aria-current={activo ? "page" : undefined}
                    className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 transition-colors duration-200 ${
                      activo
                        ? "bg-brand-800 text-white shadow-lg shadow-ink-900/10"
                        : "text-ink-600 hover:bg-ink-200 hover:text-brand-800"
                    }`}
                  >
                    {activo && (
                      <span className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-accent-400" />
                    )}

                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        activo
                          ? "bg-accent-400 text-brand-950"
                          : "bg-ink-100 text-ink-500 group-hover:bg-brand-100 group-hover:text-brand-700"
                      }`}
                    >
                      {item.icono}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-bold">{item.nombre}</span>
                      <span
                        className={`mt-0.5 block text-[10px] ${
                          activo ? "text-brand-100/70" : "text-ink-500"
                        }`}
                      >
                        {item.descripcion}
                      </span>
                    </span>

                    {cantidad > 0 && (
                      <span
                        aria-label={`${cantidad} en el carrito`}
                        className={`numero-tabular grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-[11px] font-extrabold ${
                          activo ? "bg-white text-brand-800" : "bg-accent-600 text-white"
                        }`}
                      >
                        {cantidad}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
