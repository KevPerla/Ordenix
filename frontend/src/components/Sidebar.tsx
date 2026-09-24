"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  role?: "cliente" | "empresa" | "repartidor";
  abierto?: boolean;
  onCerrar?: () => void;
};

/* ============================================================
   MENÚS
============================================================ */

const menus = {
  cliente: [
    {
      name: "Inicio",
      href: "/cliente",
      description: "Resumen general",
      icon: (
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
        </svg>
      ),
    },
    {
      name: "Catalogo",
      href: "/cliente/menu",
      description: "Productos disponibles",
      icon: (
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
          <path d="M3.5 7.5 12 12l8.5-4.5" />
          <path d="M12 12v9" />
        </svg>
      ),
    },
    {
      name: "Perfil",
      href: "/cliente/perfil",
      description: "Tu información",
      icon: (
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c.8-4.1 3.5-6 8-6s7.2 1.9 8 6" />
        </svg>
      ),
    },
  ],

  empresa: [
    {
      name: "Dashboard",
      href: "/empresa",
      description: "Vista general",
      icon: (
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      name: "Productos",
      href: "/empresa/productos",
      description: "Catalogo e inventario",
      icon: (
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
          <path d="M3.5 7.5 12 12l8.5-4.5" />
          <path d="M12 12v9" />
        </svg>
      ),
    },
    {
      name: "Pedidos",
      href: "/empresa/pedidos",
      description: "Seguimiento y estados",
      icon: (
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 8h14l-1 12H6z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      ),
    },
    {
      name: "Usuarios",
      href: "/empresa/usuarios",
      description: "Gestionar equipo",
      icon: (
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c.6-3.3 2.6-5 6-5s5.4 1.7 6 5" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8" />
          <path d="M17 15c2.1.5 3.4 2.1 4 5" />
        </svg>
      ),
    },
  ],

  repartidor: [
    {
      name: "Inicio",
      href: "/repartidor",
      description: "Resumen general",
      icon: (
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
        </svg>
      ),
    },
    {
      name: "Pedidos",
      href: "/repartidor/pedidos",
      description: "Gestionar entregas",
      icon: (
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
      ),
    },
  ],
};

/* ============================================================
   SIDEBAR
============================================================ */

export default function Sidebar({
  role = "cliente",
  abierto = false,
  onCerrar,
}: SidebarProps) {
  const pathname = usePathname();

  const items = menus[role];

  /* ==========================================================
     HOME
  ========================================================== */

  const homeHref =
    role === "cliente"
      ? "/cliente"
      : role === "empresa"
        ? "/empresa"
        : "/repartidor";

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
      className={`
        fixed inset-y-0 left-0 z-50
        flex w-[280px] max-w-[85vw] flex-col
        overflow-y-auto overflow-x-hidden
        border-r border-[#E2E8F0]
        bg-gradient-to-b
        from-[#EEF2F7]
        via-[#F6F8FC]
        to-white
        transition-transform duration-300 ease-out
        lg:translate-x-0
        ${abierto ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* ======================================================
          DECORACIONES
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -left-24
          -top-24
          h-[280px]
          w-[280px]
          rounded-full
          bg-brand-400/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          top-[35%]
          h-[220px]
          w-[220px]
          rounded-full
          bg-brand-300/10
          blur-3xl
        "
      />

      {/* ======================================================
          LOGO
      ====================================================== */}

      <div className="relative px-7 pb-7 pt-8">
        <Link
          href={homeHref}
          onClick={onCerrar}
          className="group flex items-center gap-3.5"
        >
          {/* Logo */}

          <div
            className="
              relative
              flex
              h-12
              w-12
              items-center
              justify-center
              overflow-hidden
              rounded-[17px]
              bg-[#1E40AF]
              shadow-xl
              shadow-ink-900/10
              transition-all
              duration-300
              group-hover:-translate-y-0.5
              group-hover:shadow-2xl
            "
          >
            {/* Luz */}

            <div
              className="
                absolute
                -right-3
                -top-3
                h-9
                w-9
                rounded-full
                bg-brand-300/30
                blur-md
              "
            />

            {/* Línea inferior */}

            <div
              className="
                absolute
                bottom-0
                left-0
                h-1
                w-full
                bg-[#FB923C]
              "
            />

            {/* Letra */}

            <span
              className="
                relative
                text-[22px]
                font-black
                tracking-[-0.08em]
                text-white
              "
            >
              O
            </span>
          </div>

          {/* Texto */}

          <div>
            <p
              className="
                text-[21px]
                font-black
                tracking-[-0.05em]
                text-[#0F172A]
              "
            >
              Ordenix
            </p>

            <p
              className="
                mt-0.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.24em]
                text-[#1D4ED8]
              "
            >
              Delivery platform
            </p>
          </div>
        </Link>
      </div>

      {/* ======================================================
          MENÚ
      ====================================================== */}

      <nav className="relative mt-9 flex-1 px-5">
        {/* Título */}

        <p
          className="
            mb-3
            px-3
            text-[10px]
            font-bold
            uppercase
            tracking-[0.2em]
            text-[#64748B]
          "
        >
          Navegación
        </p>

        {/* Items */}

        <div className="space-y-1.5">
          {items.map((item) => {
            const isActive =
              item.href === homeHref
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCerrar}
                className={`
                  group
                  relative
                  flex
                  items-center
                  gap-3
                  overflow-hidden
                  rounded-2xl
                  px-3
                  py-3
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-[#1E40AF] text-white shadow-lg shadow-ink-900/10"
                      : "text-[#475569] hover:bg-[#E2E8F0] hover:text-[#1E40AF]"
                  }
                `}
              >
                {/* Línea activa */}

                {isActive && (
                  <span
                    className="
                      absolute
                      bottom-3
                      left-0
                      top-3
                      w-1
                      rounded-r-full
                      bg-[#FB923C]
                    "
                  />
                )}

                {/* Icono */}

                <span
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    transition-all

                    ${
                      isActive
                        ? "bg-[#FB923C] text-[#172554]"
                        : "bg-[#EEF2F7] text-[#64748B] group-hover:bg-[#DBEAFE] group-hover:text-[#1D4ED8]"
                    }
                  `}
                >
                  {item.icon}
                </span>

                {/* Texto */}

                <div className="min-w-0">
                  <p className="text-[13px] font-bold">
                    {item.name}
                  </p>

                  <p
                    className={`
                      mt-0.5
                      text-[10px]

                      ${
                        isActive
                          ? "text-brand-100/70"
                          : "text-[#64748B]"
                      }
                    `}
                  >
                    {item.description}
                  </p>
                </div>

                {/* Flecha */}

                <svg
                  className={`
                    ml-auto
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }
                  `}
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            );
          })}
        </div>
      </nav>

    </aside>
    </>
  );
}