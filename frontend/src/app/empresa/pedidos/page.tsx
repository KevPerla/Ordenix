import EnConstruccion from "@/components/EnConstruccion";

export default function EmpresaPedidosPage() {
  return (
    <EnConstruccion
      area="empresa"
      titulo="Pedidos"
      descripcion="Verás cada pedido entrante y podrás asignarle un repartidor."
      volverA="/empresa"
    />
  );
}
