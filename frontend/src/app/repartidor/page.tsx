"use client";

import Link from "next/link";
import { totalVendido } from "@/domain/pedido";
import { primerNombre } from "@/domain/usuario";
import { pedidos } from "@/infrastructure/contenedor";
import AccesoPorRol from "@/presentation/components/AccesoPorRol";
import PanelShell from "@/presentation/components/PanelShell";
import EncabezadoPanel from "@/presentation/components/panel/EncabezadoPanel";
import EstadoVacio from "@/presentation/components/panel/EstadoVacio";
import Metrica from "@/presentation/components/panel/Metrica";
import Tarjeta from "@/presentation/components/panel/Tarjeta";
import { BOTON_PRIMARIO } from "@/presentation/components/panel/estilos";
import {
  IconoDinero,
  IconoFlecha,
  IconoMoto,
  IconoReloj,
  IconoRuta,
} from "@/presentation/components/panel/iconos";
import ListaPedidos from "@/presentation/components/pedido/ListaPedidos";
import { useAuth } from "@/presentation/contexto/AuthContext";
import { esMismoDia } from "@/presentation/formato/fechas";
import { formatearMoneda } from "@/presentation/formato/moneda";
import { useConsulta } from "@/presentation/hooks/useConsulta";

const TURNO = [
  { titulo: "Toma una entrega", detalle: "Los pedidos en preparación aparecen como listos para salir." },
  { titulo: "Sal a entregar", detalle: "El pedido queda a tu nombre y el cliente lo ve en camino." },
  { titulo: "Confirma la entrega", detalle: "Cobra el total en efectivo y márcalo como entregado." },
];

async function cargarTurno() {
  const lista = await pedidos.listar();
  const ahora = new Date();
  const entregadosHoy = lista.filter(
    (pedido) => pedido.estado === "ENTREGADO" && esMismoDia(pedido.updatedAt, ahora),
  );

  return {
    enRuta: lista.filter((pedido) => pedido.estado === "EN_CAMINO"),
    listos: lista.filter((pedido) => pedido.estado === "EN_PREPARACION").length,
    entregadosHoy: entregadosHoy.length,
    efectivoHoy: totalVendido(entregadosHoy),
  };
}

export default function RepartidorPage() {
  const { usuario } = useAuth();
  const nombre = primerNombre(usuario);
  const { datos, cargando } = useConsulta(cargarTurno, [], { refrescarCadaMs: 15_000 });

  const valor = (texto: string | number | undefined) =>
    cargando || texto === undefined ? "—" : String(texto);

  return (
    <PanelShell area="repartidor" titulo="Inicio">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Hola"
          nombre={nombre ? `Hola, ${nombre}` : "Panel de reparto"}
          descripcion="Tomas los pedidos listos, marcas cada avance y cierras el turno con el efectivo cuadrado."
          accion={
            <Link href="/repartidor/pedidos" className={BOTON_PRIMARIO}>
              Ver entregas
              {IconoFlecha}
            </Link>
          }
        />

        <AccesoPorRol />

        <section aria-label="Resumen del turno" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metrica
            etiqueta="En ruta"
            valor={valor(datos?.enRuta.length)}
            detalle="Pedidos que llevas ahora"
            icono={IconoMoto}
            tono="marca"
          />
          <Metrica
            etiqueta="Listos para salir"
            valor={valor(datos?.listos)}
            detalle="Esperando repartidor"
            icono={IconoReloj}
            tono="alerta"
          />
          <Metrica
            etiqueta="Entregados hoy"
            valor={valor(datos?.entregadosHoy)}
            detalle="Cerrados en tu turno"
            icono={IconoRuta}
            tono="exito"
          />
          <Metrica
            etiqueta="Efectivo cobrado"
            valor={valor(datos && formatearMoneda(datos.efectivoHoy))}
            detalle="Total de las entregas de hoy"
            icono={IconoDinero}
            tono="neutro"
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Tarjeta titulo="En ruta" descripcion="Lo que tienes asignado ahora">
            {cargando ? (
              <div className="esqueleto m-5 h-32 rounded-xl" />
            ) : datos && datos.enRuta.length > 0 ? (
              <ListaPedidos pedidos={datos.enRuta} enlace={() => "/repartidor/pedidos"} />
            ) : (
              <EstadoVacio
                icono={IconoReloj}
                titulo="No tienes entregas asignadas"
                descripcion="Cuando tomes un pedido listo verás aquí la dirección, el detalle y el monto a cobrar."
                accion={
                  <Link href="/repartidor/pedidos" className={BOTON_PRIMARIO}>
                    Buscar entregas
                  </Link>
                }
              />
            )}
          </Tarjeta>

          <Tarjeta titulo="Tu turno" descripcion="El flujo de cada entrega">
            <ol className="divide-y divide-line-soft">
              {TURNO.map((paso, indice) => (
                <li key={paso.titulo} className="flex gap-3.5 px-5 py-3.5">
                  <span className="numero-tabular grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-[12px] font-bold text-brand-700">
                    {indice + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-bold text-ink-900">
                      {paso.titulo}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-500">
                      {paso.detalle}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Tarjeta>
        </div>
      </div>
    </PanelShell>
  );
}
