import EnConstruccion from "@/components/EnConstruccion";

export default function RepartidorPedidosPage() {
  return (
    <EnConstruccion
      area="repartidor"
      titulo="Detalle del pedido"
      descripcion="Consultarás el detalle de la entrega y el monto a cobrar en efectivo."
      volverA="/repartidor"
    />
  );
}
