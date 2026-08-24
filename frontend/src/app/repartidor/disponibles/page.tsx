import EnConstruccion from "@/components/EnConstruccion";

export default function RepartidorDisponiblesPage() {
  return (
    <EnConstruccion
      area="repartidor"
      titulo="Pedidos disponibles"
      descripcion="Aparecerán los pedidos listos para despacho que puedas tomar."
      volverA="/repartidor"
    />
  );
}
