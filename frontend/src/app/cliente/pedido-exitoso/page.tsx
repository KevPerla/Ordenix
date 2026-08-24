import EnConstruccion from "@/components/EnConstruccion";

export default function ClientePedidoExitosoPage() {
  return (
    <EnConstruccion
      area="cliente"
      titulo="Pedido exitoso"
      descripcion="Verás el comprobante de tu pedido y el tiempo estimado de entrega."
      volverA="/cliente"
    />
  );
}
