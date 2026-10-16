"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { pedidos } from "@/infrastructure/contenedor";
import PanelShell from "@/presentation/components/PanelShell";
import VistaPedido, {
  PedidoNoDisponible,
} from "@/presentation/components/pedido/VistaPedido";
import { useConsulta } from "@/presentation/hooks/useConsulta";

export default function ClienteSeguimientoPage() {
  const { id } = useParams<{ id: string }>();
  const consulta = useConsulta(() => pedidos.obtener(id), [id], {
    refrescarCadaMs: 10_000,
    respaldo: "No se pudo cargar el pedido",
  });

  return (
    <PanelShell area="cliente" titulo="Seguimiento">
      <div className="space-y-4">
        <Link
          href="/cliente/pedidos"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-500 hover:text-brand-700"
        >
          ← Mis pedidos
        </Link>

        {consulta.datos ? (
          <VistaPedido pedido={consulta.datos} />
        ) : consulta.error ? (
          <PedidoNoDisponible mensaje={consulta.error} />
        ) : (
          <div className="esqueleto h-80 rounded-[var(--radius-card)]" />
        )}
      </div>
    </PanelShell>
  );
}
