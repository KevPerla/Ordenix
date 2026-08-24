import EnConstruccion from "@/components/EnConstruccion";

export default function ClienteConfirmarPedidoPage() {
  return (
    <EnConstruccion
      area="cliente"
      titulo="Confirmar pedido"
      descripcion="Revisarás la dirección, el método de pago y el total antes de enviar la orden."
      volverA="/cliente"
    />
  );
}
