"use client";

import { useState } from "react";
import {
  ETIQUETA_ESTADO,
  RECORRIDO,
  estaActivo,
  folio,
  type EstadoPedido,
  type Pedido,
} from "@/domain/pedido";
import { pedidos } from "@/infrastructure/contenedor";
import PanelShell from "@/presentation/components/PanelShell";
import EncabezadoPanel from "@/presentation/components/panel/EncabezadoPanel";
import EstadoVacio from "@/presentation/components/panel/EstadoVacio";
import Tarjeta from "@/presentation/components/panel/Tarjeta";
import { IconoBolsa } from "@/presentation/components/panel/iconos";
import AccionesPedido from "@/presentation/components/pedido/AccionesPedido";
import InsigniaEstado from "@/presentation/components/pedido/InsigniaEstado";
import VistaPedido from "@/presentation/components/pedido/VistaPedido";
import { formatearHora } from "@/presentation/formato/fechas";
import { formatearMoneda } from "@/presentation/formato/moneda";
import { useAvanzarPedido } from "@/presentation/hooks/useAvanzarPedido";
import { useConsulta } from "@/presentation/hooks/useConsulta";

type Filtro = "ACTIVOS" | "TODOS" | EstadoPedido;

const FILTROS: Filtro[] = ["ACTIVOS", ...RECORRIDO, "CANCELADO", "TODOS"];

const ETIQUETA_FILTRO: Record<Filtro, string> = {
  ...ETIQUETA_ESTADO,
  ACTIVOS: "En curso",
  TODOS: "Todos",
};

function coincide(pedido: Pedido, filtro: Filtro): boolean {
  if (filtro === "TODOS") return true;
  if (filtro === "ACTIVOS") return estaActivo(pedido);
  return pedido.estado === filtro;
}

export default function EmpresaPedidosPage() {
  const [filtro, setFiltro] = useState<Filtro>("ACTIVOS");
  const [seleccion, setSeleccion] = useState<string | null>(null);

  const consulta = useConsulta(() => pedidos.listar(), [], {
    refrescarCadaMs: 10_000,
    respaldo: "No se pudieron cargar los pedidos",
  });
  const { avanzar, ocupado } = useAvanzarPedido(consulta.recargar);

  const todos = consulta.datos ?? [];
  const visibles = todos.filter((pedido) => coincide(pedido, filtro));
  const seleccionado =
    visibles.find((pedido) => pedido.id === seleccion) ?? visibles[0];

  return (
    <PanelShell area="empresa" titulo="Pedidos">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Operación"
          nombre="Monitoreo de pedidos"
          descripcion="Confirma pagos, manda a preparar y despacha. Cada pedido solo ofrece los pasos que su estado permite."
        />

        <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
          {FILTROS.map((opcion) => {
            const activo = opcion === filtro;
            const total = todos.filter((pedido) => coincide(pedido, opcion)).length;

            return (
              <button
                key={opcion}
                type="button"
                aria-pressed={activo}
                onClick={() => setFiltro(opcion)}
                className={`presionable inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-bold ${
                  activo
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-line bg-surface text-ink-600 hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                {ETIQUETA_FILTRO[opcion]}
                <span
                  className={`numero-tabular text-[11.5px] ${activo ? "text-brand-100" : "text-ink-400"}`}
                >
                  {total}
                </span>
              </button>
            );
          })}
        </div>

        {consulta.cargando ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <div className="esqueleto h-96 rounded-[var(--radius-card)]" />
            <div className="esqueleto h-96 rounded-[var(--radius-card)]" />
          </div>
        ) : consulta.error && todos.length === 0 ? (
          <Tarjeta titulo="No se pudieron cargar los pedidos">
            <p role="alert" className="px-5 py-5 text-[13.5px] text-red-600">
              {consulta.error}
            </p>
          </Tarjeta>
        ) : visibles.length === 0 ? (
          <Tarjeta>
            <EstadoVacio
              icono={IconoBolsa}
              titulo={`Sin pedidos en "${ETIQUETA_FILTRO[filtro]}"`}
              descripcion="Cuando un cliente confirme una compra aparecerá aquí. La lista se actualiza sola cada pocos segundos."
            />
          </Tarjeta>
        ) : (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <Tarjeta titulo="Pedidos" descripcion={`${visibles.length} en esta vista`}>
              <ul className="max-h-[70dvh] divide-y divide-line-soft overflow-y-auto">
                {visibles.map((pedido) => {
                  const activo = pedido.id === seleccionado?.id;

                  return (
                    <li key={pedido.id}>
                      <button
                        type="button"
                        aria-pressed={activo}
                        onClick={() => setSeleccion(pedido.id)}
                        className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-150 ${
                          activo ? "bg-brand-50" : "hover:bg-ink-50"
                        }`}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="font-mono text-[13px] font-bold text-ink-900">
                              {folio(pedido)}
                            </span>
                            <InsigniaEstado estado={pedido.estado} />
                          </span>
                          <span className="mt-1 block truncate text-[12px] text-ink-500">
                            {pedido.entrega.cliente} · {formatearHora(pedido.createdAt)}
                          </span>
                        </span>
                        <span className="numero-tabular text-[14px] font-extrabold text-ink-900">
                          {formatearMoneda(pedido.total)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Tarjeta>

            {seleccionado && (
              <VistaPedido
                pedido={seleccionado}
                mostrarCliente
                acciones={
                  <AccionesPedido
                    pedido={seleccionado}
                    ocupado={ocupado === seleccionado.id}
                    alAvanzar={(destino) => void avanzar(seleccionado, destino)}
                  />
                }
              />
            )}
          </div>
        )}
      </div>
    </PanelShell>
  );
}
