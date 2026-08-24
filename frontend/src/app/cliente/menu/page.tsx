import EnConstruccion from "@/components/EnConstruccion";

export default function ClienteMenuPage() {
  return (
    <EnConstruccion
      area="cliente"
      titulo="Menú"
      descripcion="Aquí verás el catálogo con las categorías, los precios y la disponibilidad de cada platillo."
      volverA="/cliente"
    />
  );
}
