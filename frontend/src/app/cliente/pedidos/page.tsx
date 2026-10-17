"use client";

import Link from "next/link";
import { estaActivo } from "@/domain/pedido";
import { pedidos } from "@/infrastructure/contenedor";
import PanelShell from "@/presentation/components/PanelShell";
import EncabezadoPanel from "@/presentation/components/panel/EncabezadoPanel";
import EstadoVacio from "@/presentation/components/panel/EstadoVacio";
import Tarjeta from "@/presentation/components/panel/Tarjeta";
import { BOTON_PRIMARIO } from "@/presentation/components/panel/estilos";
import { IconoBolsa } from "@/presentation/components/panel/iconos";
import ListaPedidos from "@/presentation/components/pedido/ListaPedidos";
import { useConsulta } from "@/presentation/hooks/useConsulta";

const enlace = (pedido: { id: string }) => `/cliente/pedidos/${pedido.id}`;

export default function ClientePedidosPage() {
  const consulta = useConsulta(() => pedidos.listar(), [], {
    refrescarCadaMs: 15_000,
    respaldo: "No se pudieron cargar tus pedidos",
  });

  const lista = consulta.datos ?? [];
  const activos = lista.filter(estaActivo);
  const cerrados = lista.filter((pedido) => !estaActivo(pedido));

  return (
    <PanelShell area="cliente" titulo="Mis pedidos">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Pedidos"
          nombre="Mis pedidos"
          descripcion="Cada cambio de estado aparece aquí en cuanto el negocio o el repartidor lo marca."
        />

        {consulta.cargando ? (
          <div className="esqueleto h-48 rounded-[var(--radius-card)]" />
        ) : consulta.error && lista.length === 0 ? (
          <Tarjeta titulo="No se pudieron cargar tus pedidos">
            <p role="alert" className="px-5 py-5 text-[13.5px] text-red-600">
              {consulta.error}
            </p>
          </Tarjeta>
        ) : lista.length === 0 ? (
          <Tarjeta>
            <EstadoVacio
              icono={IconoBolsa}
              titulo="Todavía no has pedido nada"
              descripcion="Cuando confirmes tu primer pedido podrás seguirlo aquí, desde que se paga hasta que llega a tu puerta."
              accion={
                <Link href="/cliente/menu" className={BOTON_PRIMARIO}>
                  Explorar el catálogo
                </Link>
              }
            />
          </Tarjeta>
        ) : (
          <>
            {activos.length > 0 && (
              <Tarjeta titulo="En curso" descripcion="Pedidos que todavía avanzan">
                <ListaPedidos pedidos={activos} enlace={enlace} />
              </Tarjeta>
            )}

            {cerrados.length > 0 && (
              <Tarjeta titulo="Historial" descripcion="Entregados y cancelados">
                <ListaPedidos pedidos={cerrados} enlace={enlace} />
              </Tarjeta>
            )}
          </>
        )}
      </div>
    </PanelShell>
  );
}
