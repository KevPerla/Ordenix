import EnConstruccion from "@/components/EnConstruccion";

export default function ClienteSeguimientoPage() {
  return (
    <EnConstruccion
      area="cliente"
      titulo="Seguimiento"
      descripcion="Seguirás tu pedido en vivo, desde la preparación hasta que llegue a tu puerta."
      volverA="/cliente"
    />
  );
}
