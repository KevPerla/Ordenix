import EnConstruccion from "@/components/EnConstruccion";

export default function ClienteCarritoPage() {
  return (
    <EnConstruccion
      area="cliente"
      titulo="Carrito"
      descripcion="Reunirás aquí lo que quieras pedir antes de confirmar la orden."
      volverA="/cliente"
    />
  );
}
