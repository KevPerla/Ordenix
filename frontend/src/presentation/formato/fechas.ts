export const ZONA_EL_SALVADOR = "America/El_Salvador";

const opcionesBase: Intl.DateTimeFormatOptions = {
  timeZone: ZONA_EL_SALVADOR,
};

function aFecha(valor: string | number | Date): Date | null {
  const fecha = valor instanceof Date ? valor : new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

export function formatearFecha(valor: string | number | Date): string {
  const fecha = aFecha(valor);
  if (!fecha) return "";

  return new Intl.DateTimeFormat("es-SV", {
    ...opcionesBase,
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(fecha);
}

export function formatearFechaCorta(valor: string | number | Date): string {
  const fecha = aFecha(valor);
  if (!fecha) return "";

  return new Intl.DateTimeFormat("es-SV", {
    ...opcionesBase,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(fecha);
}

export function formatearHora(valor: string | number | Date): string {
  const fecha = aFecha(valor);
  if (!fecha) return "";

  return new Intl.DateTimeFormat("es-SV", {
    ...opcionesBase,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(fecha);
}

export function formatearFechaHora(valor: string | number | Date): string {
  const fecha = aFecha(valor);
  if (!fecha) return "";

  return new Intl.DateTimeFormat("es-SV", {
    ...opcionesBase,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(fecha);
}

export function esMismoDia(
  a: string | number | Date,
  b: string | number | Date,
): boolean {
  const primera = formatearFecha(a);
  return primera !== "" && primera === formatearFecha(b);
}

export function formatearRelativo(valor: string | number | Date): string {
  const fecha = aFecha(valor);
  if (!fecha) return "";

  const segundos = Math.round((fecha.getTime() - Date.now()) / 1000);
  const tramos: [Intl.RelativeTimeFormatUnit, number][] = [
    ["second", 60],
    ["minute", 60],
    ["hour", 24],
    ["day", 7],
    ["week", 4.35],
    ["month", 12],
    ["year", Number.POSITIVE_INFINITY],
  ];

  const formateador = new Intl.RelativeTimeFormat("es-SV", { numeric: "auto" });

  let valorTramo = segundos;
  for (const [unidad, limite] of tramos) {
    if (Math.abs(valorTramo) < limite) {
      return formateador.format(Math.round(valorTramo), unidad);
    }
    valorTramo /= limite;
  }

  return formatearFecha(fecha);
}
