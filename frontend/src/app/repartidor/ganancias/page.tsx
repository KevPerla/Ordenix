import EnConstruccion from "@/presentation/components/EnConstruccion";

export default function RepartidorGananciasPage() {
  return (
    <EnConstruccion
      area="repartidor"
      titulo="Mis ganancias"
      descripcion="Consultarás lo que has ganado y el efectivo que debes liquidar."
      volverA="/repartidor"
    />
  );
}
