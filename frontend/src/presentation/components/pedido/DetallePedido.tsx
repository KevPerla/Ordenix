import type { Pedido } from "@/domain/pedido";
import { IconoUbicacion } from "@/presentation/components/panel/iconos";
import { formatearMoneda } from "@/presentation/formato/moneda";

interface DetallePedidoProps {
  pedido: Pedido;
  mostrarCliente?: boolean;
}

export default function DetallePedido({
  pedido,
  mostrarCliente = false,
}: DetallePedidoProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-line-soft text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
              <th className="py-2 pr-3">Producto</th>
              <th className="px-3 py-2 text-right">Cant.</th>
              <th className="px-3 py-2 text-right">Precio sin IVA</th>
              <th className="py-2 pl-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {pedido.lineas.map((linea) => (
              <tr key={linea.productoId}>
                <td className="py-2.5 pr-3 font-semibold text-ink-900">{linea.nombre}</td>
                <td className="numero-tabular px-3 py-2.5 text-right text-ink-700">
                  {linea.cantidad}
                </td>
                <td className="numero-tabular px-3 py-2.5 text-right text-ink-600">
                  {formatearMoneda(linea.precioUnitario)}
                </td>
                <td className="numero-tabular py-2.5 pl-3 text-right font-semibold text-ink-900">
                  {formatearMoneda(linea.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-ink-500">Subtotal sin IVA</dt>
            <dd className="numero-tabular font-semibold text-ink-700">
              {formatearMoneda(pedido.subtotal)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">IVA 13%</dt>
            <dd className="numero-tabular font-semibold text-ink-700">
              {formatearMoneda(pedido.impuesto)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <dt className="font-bold text-ink-900">Total en efectivo</dt>
            <dd className="numero-tabular text-[18px] font-extrabold tracking-[-0.02em] text-brand-700">
              {formatearMoneda(pedido.total)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="space-y-3 rounded-[var(--radius-control)] bg-ink-50 p-4 text-[13px]">
        <div className="flex gap-2.5">
          <span className="mt-0.5 text-ink-400">{IconoUbicacion}</span>
          <div className="min-w-0">
            <p className="font-semibold text-ink-900">{pedido.entrega.direccion}</p>
            {pedido.entrega.referencia && (
              <p className="mt-0.5 text-ink-500">{pedido.entrega.referencia}</p>
            )}
          </div>
        </div>

        {mostrarCliente && (
          <p className="border-t border-line pt-3 text-ink-600">
            <span className="font-semibold text-ink-900">{pedido.entrega.cliente}</span>
            {" · "}
            <a
              href={`tel:${pedido.entrega.telefono}`}
              className="numero-tabular font-semibold text-brand-700 hover:underline"
            >
              {pedido.entrega.telefono}
            </a>
          </p>
        )}

        {pedido.notas && (
          <p className="border-t border-line pt-3 text-ink-600">
            <span className="font-semibold text-ink-900">Notas: </span>
            {pedido.notas}
          </p>
        )}
      </div>
    </div>
  );
}
