import EnConstruccion from "@/components/EnConstruccion";

export default function RepartidorEntregaPage() {
  return (
    <EnConstruccion
      area="repartidor"
      titulo="Detalle de entrega"
      descripcion="Verás la ruta, el cliente y el efectivo a recibir en esta entrega."
      volverA="/repartidor"
    />
  );
}
