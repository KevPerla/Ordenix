import EnConstruccion from "@/components/EnConstruccion";

export default function ClientePedidosPage() {
  return (
    <EnConstruccion
      area="cliente"
      titulo="Mis pedidos"
      descripcion="Tendrás el historial completo de tus pedidos con su estado y su total."
      volverA="/cliente"
    />
  );
}
