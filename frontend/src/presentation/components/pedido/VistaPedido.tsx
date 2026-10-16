import type { ReactNode } from "react";
import { folio, type Pedido } from "@/domain/pedido";
import Tarjeta from "@/presentation/components/panel/Tarjeta";
import DetallePedido from "@/presentation/components/pedido/DetallePedido";
import InsigniaEstado from "@/presentation/components/pedido/InsigniaEstado";
import RielEstados from "@/presentation/components/pedido/RielEstados";
import { formatearFechaHora } from "@/presentation/formato/fechas";

interface VistaPedidoProps {
  pedido: Pedido;
  mostrarCliente?: boolean;
  acciones?: ReactNode;
}

export default function VistaPedido({
  pedido,
  mostrarCliente,
  acciones,
}: VistaPedidoProps) {
  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[var(--sombra-baja)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="font-mono text-[15px] font-bold text-ink-900">{folio(pedido)}</h2>
            <InsigniaEstado estado={pedido.estado} />
          </div>
          <p className="numero-tabular mt-0.5 text-[12.5px] text-ink-500">
            Creado el {formatearFechaHora(pedido.createdAt)}
          </p>
        </div>

        {acciones}
      </header>

      <div className="border-b border-line-soft px-5 py-5">
        <RielEstados pedido={pedido} />
      </div>

      <div className="px-5 py-5">
        <DetallePedido pedido={pedido} mostrarCliente={mostrarCliente} />
      </div>
    </section>
  );
}

export function PedidoNoDisponible({ mensaje }: { mensaje: string }) {
  return (
    <Tarjeta titulo="No se pudo abrir el pedido">
      <p role="alert" className="px-5 py-5 text-[13.5px] text-red-600">
        {mensaje}
      </p>
    </Tarjeta>
  );
}
