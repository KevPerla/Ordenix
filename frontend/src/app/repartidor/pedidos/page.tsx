import EnConstruccion from "@/components/EnConstruccion";

export default function RepartidorPedidosPage() {
  return (
    <EnConstruccion
      area="repartidor"
      titulo="Mis pedidos"
      descripcion="Verás los pedidos que tienes asignados y su dirección de entrega."
      volverA="/repartidor"
    />
  );
}
