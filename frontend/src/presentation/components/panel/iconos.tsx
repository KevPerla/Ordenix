const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconoCaja = (
  <svg {...base}>
    <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
    <path d="M3.5 7.5 12 12l8.5-4.5" />
    <path d="M12 12v9" />
  </svg>
);

export const IconoBolsa = (
  <svg {...base}>
    <path d="M5 8h14l-1 12H6z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export const IconoUsuarios = (
  <svg {...base}>
    <circle cx="9" cy="8" r="3.4" />
    <path d="M3 20c.7-3.6 3-5.3 6-5.3s5.3 1.7 6 5.3" />
    <path d="M16 4.5a3.4 3.4 0 0 1 0 7" />
    <path d="M17.5 14.9c2.2.5 3.7 2.2 4.2 5.1" />
  </svg>
);

export const IconoMoto = (
  <svg {...base}>
    <circle cx="5.5" cy="17.5" r="3" />
    <circle cx="18.5" cy="17.5" r="3" />
    <path d="M8.5 17.5h7l-3-8h-3" />
    <path d="M13 9.5h4l1.5 8" />
  </svg>
);

export const IconoReloj = (
  <svg {...base}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </svg>
);

export const IconoDinero = (
  <svg {...base}>
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
);

export const IconoGrafica = (
  <svg {...base}>
    <path d="M4 19.5V13" />
    <path d="M10 19.5V6" />
    <path d="M16 19.5v-9" />
    <path d="M21 19.5H3" />
  </svg>
);

export const IconoEscudo = (
  <svg {...base}>
    <path d="M12 3l7.5 3v5.5c0 4.5-3 8-7.5 9.5-4.5-1.5-7.5-5-7.5-9.5V6z" />
    <path d="m9 12 2 2 4-4.5" />
  </svg>
);

export const IconoRuta = (
  <svg {...base}>
    <circle cx="6" cy="6" r="2.6" />
    <circle cx="18" cy="18" r="2.6" />
    <path d="M8.6 6H14a3.4 3.4 0 0 1 0 6.8h-4a3.4 3.4 0 0 0 0 6.8h5.4" />
  </svg>
);

export const IconoInicio = (
  <svg {...base}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

export const IconoTablero = (
  <svg {...base}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconoPerfil = (
  <svg {...base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c.8-4.1 3.5-6 8-6s7.2 1.9 8 6" />
  </svg>
);

export const IconoCarrito = (
  <svg {...base}>
    <path d="M3 4h2.2l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2" />
    <circle cx="9.5" cy="20" r="1.3" />
    <circle cx="17" cy="20" r="1.3" />
  </svg>
);

export const IconoMas = (
  <svg {...base} strokeWidth={2.2}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const IconoMenos = (
  <svg {...base} strokeWidth={2.2}>
    <path d="M5 12h14" />
  </svg>
);

export const IconoBasura = (
  <svg {...base}>
    <path d="M4 7h16" />
    <path d="M9.5 7V4.5h5V7" />
    <path d="M6.5 7l1 13h9l1-13" />
  </svg>
);

export const IconoFlecha = (
  <svg {...base} strokeWidth={2.2}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const IconoUbicacion = (
  <svg {...base}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

export const IconoEstrella = (
  <svg {...base}>
    <path d="m12 4 2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 17.4 6.75 20.15l1-5.85L3.5 10.15l5.9-.85z" />
  </svg>
);
