import EnConstruccion from "@/components/EnConstruccion";

export default function ClienteEmpresaPage() {
  return (
    <EnConstruccion
      area="cliente"
      titulo="Comercio"
      descripcion="Verás el detalle de cada comercio con su menú y su tiempo estimado de entrega."
      volverA="/cliente"
    />
  );
}
