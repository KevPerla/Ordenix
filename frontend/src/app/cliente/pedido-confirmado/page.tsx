import EnConstruccion from "@/components/EnConstruccion";

export default function ClientePedidoConfirmadoPage() {
  return (
    <EnConstruccion
      area="cliente"
      titulo="Pedido confirmado"
      descripcion="Confirmaremos aquí que el comercio recibió tu orden."
      volverA="/cliente"
    />
  );
}
