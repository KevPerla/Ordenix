const formateador = new Intl.NumberFormat("es-SV", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatearMoneda(valor: number): string {
  return formateador.format(Number.isFinite(valor) ? valor : 0);
}
