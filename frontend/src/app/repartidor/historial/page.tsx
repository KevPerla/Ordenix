"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useMemo, useState } from "react";

type Entrega = {
  id: string;
  empresa: string;
  cliente: string;
  fecha: string;
  hora: string;
  distancia: string;
  duracion: string;
  pedido: number;
  ganancia: number;
  calificacion: number;
  estado: "Entregado" | "Cancelado";
};

const historialInicial: Entrega[] = [
  {
    id: "#ORD-000126",
    empresa: "Pizza Center",
    cliente: "Carlos Hernández",
    fecha: "20 Ago 2026",
    hora: "08:45 AM",
    distancia: "1.8 km",
    duracion: "14 min",
    pedido: 13.75,
    ganancia: 3.5,
    calificacion: 5,
    estado: "Entregado",
  },
  {
    id: "#ORD-000124",
    empresa: "Burger House",
    cliente: "Sofía Ramírez",
    fecha: "20 Ago 2026",
    hora: "08:10 AM",
    distancia: "2.7 km",
    duracion: "18 min",
    pedido: 18.5,
    ganancia: 4.25,
    calificacion: 5,
    estado: "Entregado",
  },
  {
    id: "#ORD-000121",
    empresa: "Taco Express",
    cliente: "Laura Martínez",
    fecha: "20 Ago 2026",
    hora: "07:35 AM",
    distancia: "3.2 km",
    duracion: "21 min",
    pedido: 12.25,
    ganancia: 4,
    calificacion: 4,
    estado: "Entregado",
  },
  {
    id: "#ORD-000117",
    empresa: "Pizza Center",
    cliente: "Daniel Flores",
    fecha: "19 Ago 2026",
    hora: "06:20 PM",
    distancia: "4.1 km",
    duracion: "26 min",
    pedido: 21.5,
    ganancia: 5,
    calificacion: 5,
    estado: "Entregado",
  },
  {
    id: "#ORD-000113",
    empresa: "Burger House",
    cliente: "Ana López",
    fecha: "19 Ago 2026",
    hora: "05:40 PM",
    distancia: "2.1 km",
    duracion: "16 min",
    pedido: 15,
    ganancia: 3.75,
    calificacion: 5,
    estado: "Entregado",
  },
  {
    id: "#ORD-000108",
    empresa: "Taco Express",
    cliente: "José Martínez",
    fecha: "19 Ago 2026",
    hora: "01:15 PM",
    distancia: "5.2 km",
    duracion: "31 min",
    pedido: 25.75,
    ganancia: 6,
    calificacion: 4,
    estado: "Entregado",
  },
  {
    id: "#ORD-000101",
    empresa: "Pizza Center",
    cliente: "Mónica García",
    fecha: "18 Ago 2026",
    hora: "07:05 PM",
    distancia: "2.9 km",
    duracion: "19 min",
    pedido: 16.25,
    ganancia: 4,
    calificacion: 5,
    estado: "Entregado",
  },
  {
    id: "#ORD-000097",
    empresa: "Burger House",
    cliente: "Pedro Sánchez",
    fecha: "18 Ago 2026",
    hora: "06:30 PM",
    distancia: "3.6 km",
    duracion: "23 min",
    pedido: 19.5,
    ganancia: 4.5,
    calificacion: 5,
    estado: "Entregado",
  },
];

export default function HistorialRepartidor() {
  const [historial] = useState(historialInicial);

  const [busqueda, setBusqueda] = useState("");

  const [filtroFecha, setFiltroFecha] = useState("Todos");

  const [entregaSeleccionada, setEntregaSeleccionada] =
    useState<Entrega | null>(null);

  const filtradas = useMemo(() => {
    return historial.filter((entrega) => {
      const texto = busqueda.toLowerCase();

      const coincideBusqueda =
        entrega.id.toLowerCase().includes(texto) ||
        entrega.empresa.toLowerCase().includes(texto) ||
        entrega.cliente.toLowerCase().includes(texto);

      let coincideFecha = true;

      if (filtroFecha === "Hoy") {
        coincideFecha = entrega.fecha === "20 Ago 2026";
      }

      if (filtroFecha === "Ayer") {
        coincideFecha = entrega.fecha === "19 Ago 2026";
      }

      return coincideBusqueda && coincideFecha;
    });
  }, [historial, busqueda, filtroFecha]);

  const totalGanancias = filtradas.reduce(
    (total, entrega) => total + entrega.ganancia,
    0
  );

  const totalDistancia = filtradas.reduce(
    (total, entrega) =>
      total + parseFloat(entrega.distancia.replace(" km", "")),
    0
  );

  const promedioCalificacion =
    filtradas.length > 0
      ? (
          filtradas.reduce(
            (total, entrega) => total + entrega.calificacion,
            0
          ) / filtradas.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen bg-[#08090d] text-white">

      <Sidebar role="repartidor" />

      <div className="ml-[260px]">

        <Navbar title="Historial" />

        <main className="p-8">

          {/* HEADER */}

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-violet-400">
                Actividad
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Historial de entregas
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Consulta todas las entregas que has realizado.
              </p>

            </div>

            <button className="rounded-xl border border-white/[0.06] px-5 py-3 text-xs text-slate-400 transition hover:bg-white/[0.04] hover:text-white">
              ↓ Exportar historial
            </button>

          </div>

          {/* ESTADÍSTICAS */}

          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-3xl border border-white/[0.06] bg-[#0d0e13] p-6">

              <p className="text-[10px] uppercase tracking-wider text-slate-700">
                Entregas
              </p>

              <p className="mt-3 text-3xl font-bold">
                {filtradas.length}
              </p>

              <p className="mt-2 text-[10px] text-slate-600">
                Entregas completadas
              </p>

            </div>

            <div className="rounded-3xl border border-white/[0.06] bg-[#0d0e13] p-6">

              <p className="text-[10px] uppercase tracking-wider text-slate-700">
                Ganancias
              </p>

              <p className="mt-3 text-3xl font-bold text-emerald-400">
                ${totalGanancias.toFixed(2)}
              </p>

              <p className="mt-2 text-[10px] text-slate-600">
                Por entregas realizadas
              </p>

            </div>

            <div className="rounded-3xl border border-white/[0.06] bg-[#0d0e13] p-6">

              <p className="text-[10px] uppercase tracking-wider text-slate-700">
                Distancia
              </p>

              <p className="mt-3 text-3xl font-bold">
                {totalDistancia.toFixed(1)} km
              </p>

              <p className="mt-2 text-[10px] text-slate-600">
                Distancia recorrida
              </p>

            </div>

            <div className="rounded-3xl border border-white/[0.06] bg-[#0d0e13] p-6">

              <p className="text-[10px] uppercase tracking-wider text-slate-700">
                Calificación
              </p>

              <p className="mt-3 text-3xl font-bold text-amber-400">
                ★ {promedioCalificacion}
              </p>

              <p className="mt-2 text-[10px] text-slate-600">
                Promedio de clientes
              </p>

            </div>

          </section>

          {/* FILTROS */}

          <section className="mt-8 rounded-3xl border border-white/[0.06] bg-[#0d0e13] p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="relative flex-1">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-700">
                  ⌕
                </span>

                <input
                  value={busqueda}
                  onChange={(e) =>
                    setBusqueda(e.target.value)
                  }
                  placeholder="Buscar por pedido, empresa o cliente..."
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-3 pl-10 pr-4 text-xs text-white outline-none placeholder:text-slate-700 focus:border-violet-500/30"
                />

              </div>

              <div className="flex gap-2">

                {["Todos", "Hoy", "Ayer"].map((filtro) => (

                  <button
                    key={filtro}
                    onClick={() =>
                      setFiltroFecha(filtro)
                    }
                    className={`rounded-xl px-5 py-3 text-[10px] transition ${
                      filtroFecha === filtro
                        ? "bg-violet-600 text-white"
                        : "border border-white/[0.06] text-slate-600 hover:text-white"
                    }`}
                  >
                    {filtro}
                  </button>

                ))}

              </div>

            </div>

          </section>

          {/* TABLA */}

          <section className="mt-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0d0e13]">

            <div className="border-b border-white/[0.06] p-6">

              <h2 className="font-semibold">
                Entregas realizadas
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                {filtradas.length} registros encontrados.
              </p>

            </div>

            {/* CABECERA */}

            <div className="hidden grid-cols-[1.1fr_1.2fr_1fr_0.8fr_0.8fr_0.7fr_0.5fr] gap-4 border-b border-white/[0.04] px-6 py-4 text-[9px] uppercase tracking-wider text-slate-700 lg:grid">

              <span>Pedido</span>
              <span>Empresa / Cliente</span>
              <span>Fecha</span>
              <span>Distancia</span>
              <span>Pedido</span>
              <span>Ganancia</span>
              <span></span>

            </div>

            {/* FILAS */}

            <div className="divide-y divide-white/[0.04]">

              {filtradas.map((entrega) => (

                <div
                  key={entrega.id}
                  className="grid gap-5 px-6 py-5 transition hover:bg-white/[0.015] lg:grid-cols-[1.1fr_1.2fr_1fr_0.8fr_0.8fr_0.7fr_0.5fr] lg:items-center"
                >

                  {/* PEDIDO */}

                  <div>

                    <p className="text-xs font-semibold">
                      {entrega.id}
                    </p>

                    <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2 py-1 text-[8px] text-emerald-400">
                      {entrega.estado}
                    </span>

                  </div>

                  {/* EMPRESA */}

                  <div>

                    <p className="text-xs font-medium">
                      {entrega.empresa}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-600">
                      {entrega.cliente}
                    </p>

                  </div>

                  {/* FECHA */}

                  <div>

                    <p className="text-xs text-slate-400">
                      {entrega.fecha}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-700">
                      {entrega.hora}
                    </p>

                  </div>

                  {/* DISTANCIA */}

                  <div>

                    <p className="text-xs font-medium">
                      {entrega.distancia}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-700">
                      {entrega.duracion}
                    </p>

                  </div>

                  {/* TOTAL */}

                  <div>

                    <p className="text-xs">
                      ${entrega.pedido.toFixed(2)}
                    </p>

                  </div>

                  {/* GANANCIA */}

                  <div>

                    <p className="text-xs font-semibold text-emerald-400">
                      +${entrega.ganancia.toFixed(2)}
                    </p>

                  </div>

                  {/* DETALLE */}

                  <div>

                    <button
                      onClick={() =>
                        setEntregaSeleccionada(entrega)
                      }
                      className="rounded-xl border border-white/[0.06] px-3 py-2 text-[9px] text-slate-500 hover:bg-white/[0.04] hover:text-white"
                    >
                      Ver
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {filtradas.length === 0 && (

              <div className="p-16 text-center">

                <div className="text-3xl">
                  🔎
                </div>

                <h3 className="mt-4 text-sm font-semibold">
                  No encontramos resultados
                </h3>

                <p className="mt-2 text-xs text-slate-600">
                  Prueba con otro término de búsqueda.
                </p>

              </div>

            )}

          </section>

          {/* RESUMEN */}

          <section className="mt-6 rounded-3xl border border-violet-500/10 bg-violet-500/[0.03] p-6">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <p className="text-[9px] uppercase tracking-wider text-violet-400">
                  Resumen
                </p>

                <h3 className="mt-2 text-sm font-semibold">
                  Tu actividad está funcionando muy bien.
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  Mantén tu calificación y continúa entregando a tiempo.
                </p>

              </div>

              <div className="flex gap-8">

                <div>

                  <p className="text-[9px] text-slate-700">
                    PROMEDIO POR ENTREGA
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    $
                    {filtradas.length
                      ? (
                          totalGanancias /
                          filtradas.length
                        ).toFixed(2)
                      : "0.00"}
                  </p>

                </div>

                <div>

                  <p className="text-[9px] text-slate-700">
                    KM PROMEDIO
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {filtradas.length
                      ? (
                          totalDistancia /
                          filtradas.length
                        ).toFixed(1)
                      : "0.0"}{" "}
                    km
                  </p>

                </div>

              </div>

            </div>

          </section>

        </main>

      </div>

      {/* MODAL DETALLE */}

      {entregaSeleccionada && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d0e13] shadow-2xl">

            <div className="flex items-center justify-between border-b border-white/[0.06] p-6">

              <div>

                <p className="text-[9px] uppercase tracking-wider text-violet-400">
                  Detalle de entrega
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                  {entregaSeleccionada.id}
                </h2>

              </div>

              <button
                onClick={() =>
                  setEntregaSeleccionada(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-slate-500 hover:text-white"
              >
                ×
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[9px] text-slate-700">
                    EMPRESA
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    {entregaSeleccionada.empresa}
                  </p>

                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-[9px] text-emerald-400">
                  ✓ Entregado
                </span>

              </div>

              <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">

                <p className="text-[9px] uppercase tracking-wider text-slate-700">
                  Cliente
                </p>

                <p className="mt-2 text-sm font-semibold">
                  {entregaSeleccionada.cliente}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  {entregaSeleccionada.fecha} ·{" "}
                  {entregaSeleccionada.hora}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-white/[0.02] p-4">

                  <p className="text-[9px] text-slate-700">
                    DISTANCIA
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {entregaSeleccionada.distancia}
                  </p>

                </div>

                <div className="rounded-2xl bg-white/[0.02] p-4">

                  <p className="text-[9px] text-slate-700">
                    DURACIÓN
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {entregaSeleccionada.duracion}
                  </p>

                </div>

              </div>

              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] text-slate-700">
                      GANANCIA DE ESTA ENTREGA
                    </p>

                    <p className="mt-2 text-2xl font-bold text-emerald-400">
                      +$
                      {entregaSeleccionada.ganancia.toFixed(2)}
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-[9px] text-slate-700">
                      CALIFICACIÓN
                    </p>

                    <p className="mt-2 text-sm text-amber-400">
                      {"★".repeat(
                        entregaSeleccionada.calificacion
                      )}
                    </p>

                  </div>

                </div>

              </div>

              <button
                onClick={() =>
                  setEntregaSeleccionada(null)
                }
                className="w-full rounded-xl border border-white/[0.06] py-3 text-xs text-slate-400 hover:bg-white/[0.04] hover:text-white"
              >
                Cerrar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}