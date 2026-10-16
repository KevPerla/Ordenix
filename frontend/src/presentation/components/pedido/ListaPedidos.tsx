import Link from "next/link";
import type { ReactNode } from "react";
import { folio, type Pedido } from "@/domain/pedido";
import InsigniaEstado from "@/presentation/components/pedido/InsigniaEstado";
import { formatearFechaHora } from "@/presentation/formato/fechas";
import { formatearMoneda } from "@/presentation/formato/moneda";

interface ListaPedidosProps {
  pedidos: Pedido[];
  enlace?: (pedido: Pedido) => string;
}

const CLASES_FILA =
  "flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 transition-colors duration-150";

function Fila({ enlace, children }: { enlace?: string; children: ReactNode }) {
  return enlace ? (
    <Link href={enlace} className={`${CLASES_FILA} hover:bg-ink-50`}>
      {children}
    </Link>
  ) : (
    <div className={CLASES_FILA}>{children}</div>
  );
}

export default function ListaPedidos({ pedidos, enlace }: ListaPedidosProps) {
  return (
    <ul className="divide-y divide-line-soft">
      {pedidos.map((pedido) => (
        <li key={pedido.id}>
          <Fila enlace={enlace?.(pedido)}>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2.5">
                <span className="font-mono text-[13px] font-bold text-ink-900">
                  {folio(pedido)}
                </span>
                <InsigniaEstado estado={pedido.estado} />
              </span>
              <span className="numero-tabular mt-1 block text-[12px] text-ink-500">
                {formatearFechaHora(pedido.createdAt)} · {pedido.unidades}{" "}
                {pedido.unidades === 1 ? "unidad" : "unidades"}
              </span>
            </span>

            <span className="numero-tabular text-[15px] font-extrabold text-ink-900">
              {formatearMoneda(pedido.total)}
            </span>
          </Fila>
        </li>
      ))}
    </ul>
  );
}
