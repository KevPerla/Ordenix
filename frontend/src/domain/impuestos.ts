export const TASA_IVA = 0.13;

export function redondearMoneda(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

export function calcularIva(base: number): number {
  return redondearMoneda(base * TASA_IVA);
}

export function agregarIva(base: number): number {
  return redondearMoneda(base + calcularIva(base));
}
