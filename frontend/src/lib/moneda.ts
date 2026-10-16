export const TASA_IVA = 0.13;

const formateador = new Intl.NumberFormat("es-SV", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatearMoneda(valor: number): string {
  return formateador.format(Number.isFinite(valor) ? valor : 0);
}

export function redondearMoneda(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export function calcularIva(base: number): number {
  return redondearMoneda(base * TASA_IVA);
}

export function agregarIva(base: number): number {
  return redondearMoneda(base + calcularIva(base));
}
