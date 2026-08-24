"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  role?: "cliente" | "empresa" | "repartidor";
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
   INFORMACIÓN DEL USUARIO
============================================================ */

const userInfo = {
  cliente: {
    initials: "MM",
    name: "Cliente",
    role: "Cliente",
  },

  empresa: {
    initials: "AD",
    name: "Administrador",
    role: "Administrador",
  },

  repartidor: {
    initials: "CH",
    name: "Carlos Hernández",
    role: "Repartidor",
  },
};

/* ============================================================
   SIDEBAR
============================================================ */

export default function Sidebar({
  role = "cliente",
}: SidebarProps) {
  const pathname = usePathname();

  const items = menus[role];
  const user = userInfo[role];

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
    <aside
      className="
        fixed inset-y-0 left-0 z-40
        flex w-[280px] flex-col
        overflow-hidden
        border-r border-[#DFE9E0]
        bg-gradient-to-b
        from-[#EDF7EF]
        via-[#F6FAF6]
        to-white
      "
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
          bg-green-400/10
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
          bg-green-300/10
          blur-3xl
        "
      />

      {/* ======================================================
          LOGO
      ====================================================== */}

      <div className="relative px-7 pb-7 pt-8">
        <Link
          href={homeHref}
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
              bg-[#166534]
              shadow-xl
              shadow-green-900/10
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
                bg-green-300/30
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
                bg-[#4ADE80]
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
                text-[#172019]
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
                text-[#15803D]
              "
            >
              Delivery platform
            </p>
          </div>
        </Link>
      </div>

      {/* ======================================================
          TARJETA DEL USUARIO
      ====================================================== */}

      <div className="relative px-5">
        <div
          className="
            relative
            overflow-hidden
            rounded-[22px]
            border
            border-[#DCE8DE]
            bg-gradient-to-br
            from-[#E6F5E8]
            via-[#F0F8F1]
            to-white
            p-4
            shadow-sm
            shadow-green-900/[0.05]
          "
        >
          {/* Decoración */}

          <div
            className="
              absolute
              -right-8
              -top-8
              h-24
              w-24
              rounded-full
              bg-green-300/15
              blur-sm
            "
          />

          <div
            className="
              absolute
              right-3
              top-3
              h-1.5
              w-1.5
              rounded-full
              bg-[#22C55E]
              shadow-sm
              shadow-green-500/40
            "
          />

          <div className="relative flex items-center gap-3">
            {/* Avatar */}

            <div
              className="
                relative
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-[15px]
                bg-[#166534]
                text-[11px]
                font-bold
                text-white
                shadow-md
                shadow-green-900/10
              "
            >
              {user.initials}

              <span
                className="
                  absolute
                  -bottom-1
                  -right-1
                  h-3.5
                  w-3.5
                  rounded-full
                  border-[3px]
                  border-[#F0F8F1]
                  bg-[#22C55E]
                "
              />
            </div>

            {/* Información */}

            <div className="min-w-0">
              <p
                className="
                  truncate
                  text-[13px]
                  font-bold
                  text-[#172019]
                "
              >
                {user.name}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />

                <p className="text-[10px] font-medium text-[#718076]">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>
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
            text-[#7B8A80]
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
                      ? "bg-[#166534] text-white shadow-lg shadow-green-900/10"
                      : "text-[#66746B] hover:bg-[#E5F3E7] hover:text-[#166534]"
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
                      bg-[#4ADE80]
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
                        ? "bg-[#4ADE80] text-[#14532D]"
                        : "bg-[#E8F2E9] text-[#718076] group-hover:bg-[#DCFCE7] group-hover:text-[#15803D]"
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
                          ? "text-green-100/70"
                          : "text-[#7B887F]"
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

      {/* ======================================================
          PARTE INFERIOR
      ====================================================== */}

      <div className="relative px-5 pb-5">

        {/* ====================================================
            ESTADO DEL SISTEMA
        ==================================================== */}

        <div
          className="
            mb-3
            rounded-2xl
            border
            border-[#D9E9DC]
            bg-gradient-to-br
            from-[#E8F6EA]
            to-[#F1F9F2]
            px-4
            py-3
            shadow-sm
            shadow-green-900/[0.03]
          "
        >
          <div className="flex items-center gap-2">
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-[#22C55E]
                shadow-sm
                shadow-green-500/50
              "
            />

            <span className="text-[11px] font-bold text-[#15803D]">
              Sistema operativo
            </span>
          </div>

          <p
            className="
              mt-1
              pl-4
              text-[10px]
              text-[#15803D]/60
            "
          >
            Todos los servicios funcionan correctamente
          </p>
        </div>

      </div>
    </aside>
  );
}