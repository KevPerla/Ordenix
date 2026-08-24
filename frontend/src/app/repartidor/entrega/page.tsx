import EnConstruccion from "@/components/EnConstruccion";

export default function RepartidorEntregaPage() {
  return (
    <EnConstruccion
      area="repartidor"
      titulo="Entrega en curso"
      descripcion="Seguirás la entrega activa y podrás marcarla como completada."
      volverA="/repartidor"
    />
  );
}
