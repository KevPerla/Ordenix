"use client";

import type { ReactNode } from "react";
import { DESTINOS_DEL_REPARTIDOR, type Pedido } from "@/domain/pedido";
import { pedidos } from "@/infrastructure/contenedor";
import PanelShell from "@/presentation/components/PanelShell";
import EncabezadoPanel from "@/presentation/components/panel/EncabezadoPanel";
import EstadoVacio from "@/presentation/components/panel/EstadoVacio";
import Tarjeta from "@/presentation/components/panel/Tarjeta";
import { IconoMoto, IconoReloj } from "@/presentation/components/panel/iconos";
import AccionesPedido from "@/presentation/components/pedido/AccionesPedido";
import ListaPedidos from "@/presentation/components/pedido/ListaPedidos";
import VistaPedido from "@/presentation/components/pedido/VistaPedido";
import { useAvanzarPedido } from "@/presentation/hooks/useAvanzarPedido";
import { useConsulta } from "@/presentation/hooks/useConsulta";

function Seccion({
  titulo,
  descripcion,
  children,
}: {
  titulo: string;
  descripcion: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <header>
        <h2 className="text-[16px] font-bold tracking-[-0.015em] text-ink-900">{titulo}</h2>
        <p className="text-[12.5px] text-ink-500">{descripcion}</p>
      </header>
      {children}
    </section>
  );
}

export default function RepartidorPedidosPage() {
  const consulta = useConsulta(() => pedidos.listar(), [], {
    refrescarCadaMs: 10_000,
    respaldo: "No se pudieron cargar las entregas",
  });
  const { avanzar, ocupado } = useAvanzarPedido(consulta.recargar);

  const todos = consulta.datos ?? [];
  const enRuta = todos.filter((pedido) => pedido.estado === "EN_CAMINO");
  const disponibles = todos.filter((pedido) => pedido.estado === "EN_PREPARACION");
  const entregados = todos.filter((pedido) => pedido.estado === "ENTREGADO");

  const tarjeta = (pedido: Pedido) => (
    <VistaPedido
      key={pedido.id}
      pedido={pedido}
      mostrarCliente
      acciones={
        <AccionesPedido
          pedido={pedido}
          permitidos={DESTINOS_DEL_REPARTIDOR}
          ocupado={ocupado === pedido.id}
          alAvanzar={(destino) => void avanzar(pedido, destino)}
        />
      }
    />
  );

  return (
    <PanelShell area="repartidor" titulo="Entregas">
      <div className="space-y-8">
        <EncabezadoPanel
          saludo="Reparto"
          nombre="Tus entregas"
          descripcion="Toma un pedido listo, sal a entregarlo y márcalo cuando el cliente lo reciba. Cobras el total en efectivo."
        />

        {consulta.cargando ? (
          <div className="esqueleto h-80 rounded-[var(--radius-card)]" />
        ) : consulta.error && todos.length === 0 ? (
          <Tarjeta titulo="No se pudieron cargar las entregas">
            <p role="alert" className="px-5 py-5 text-[13.5px] text-red-600">
              {consulta.error}
            </p>
          </Tarjeta>
        ) : (
          <>
            <Seccion titulo="En ruta" descripcion="Pedidos que llevas ahora mismo">
              {enRuta.length > 0 ? (
                enRuta.map(tarjeta)
              ) : (
                <Tarjeta>
                  <EstadoVacio
                    icono={IconoMoto}
                    titulo="No llevas ningún pedido"
                    descripcion="Toma uno de los pedidos listos para salir y aparecerá aquí con la dirección y el monto a cobrar."
                  />
                </Tarjeta>
              )}
            </Seccion>

            <Seccion
              titulo="Listos para salir"
              descripcion="En preparación y sin repartidor asignado"
            >
              {disponibles.length > 0 ? (
                disponibles.map(tarjeta)
              ) : (
                <Tarjeta>
                  <EstadoVacio
                    icono={IconoReloj}
                    titulo="Nada listo por ahora"
                    descripcion="Cuando el negocio mande un pedido a preparación aparecerá aquí. La lista se actualiza sola."
                  />
                </Tarjeta>
              )}
            </Seccion>

            {entregados.length > 0 && (
              <Seccion titulo="Entregados" descripcion="Tu historial reciente">
                <Tarjeta>
                  <ListaPedidos pedidos={entregados} />
                </Tarjeta>
              </Seccion>
            )}
          </>
        )}
      </div>
    </PanelShell>
  );
}
