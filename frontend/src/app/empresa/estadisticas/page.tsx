import EnConstruccion from "@/components/EnConstruccion";

export default function EmpresaEstadisticasPage() {
  return (
    <EnConstruccion
      area="empresa"
      titulo="Estadísticas"
      descripcion="Analizarás la operación con métricas de pedidos, tiempos y productos más vendidos."
      volverA="/empresa"
    />
  );
}
