"use client";

import Link from "next/link";
import { primerNombre } from "@/domain/usuario";
import { estaActivo, totalVendido } from "@/domain/pedido";
import { pedidos } from "@/infrastructure/contenedor";
import AccesoPorRol from "@/presentation/components/AccesoPorRol";
import PanelShell from "@/presentation/components/PanelShell";
import EncabezadoPanel from "@/presentation/components/panel/EncabezadoPanel";
import EstadoVacio from "@/presentation/components/panel/EstadoVacio";
import Metrica from "@/presentation/components/panel/Metrica";
import Tarjeta from "@/presentation/components/panel/Tarjeta";
import { BOTON_ACENTO, BOTON_PRIMARIO } from "@/presentation/components/panel/estilos";
import {
  IconoBolsa,
  IconoDinero,
  IconoFlecha,
  IconoReloj,
  IconoRuta,
} from "@/presentation/components/panel/iconos";
import ListaPedidos from "@/presentation/components/pedido/ListaPedidos";
import { useAuth } from "@/presentation/contexto/AuthContext";
import { formatearMoneda } from "@/presentation/formato/moneda";
import { useConsulta } from "@/presentation/hooks/useConsulta";

const PASOS = [
  { titulo: "Explora el catálogo", detalle: "Filtra por categoría y compara precios con y sin IVA." },
  { titulo: "Arma tu carrito", detalle: "Ajusta cantidades y mira el total actualizarse al instante." },
  { titulo: "Confirma el pedido", detalle: "Escribe tu dirección y paga en efectivo al recibir." },
  { titulo: "Sigue la entrega", detalle: "Ves cada cambio de estado hasta que toca tu puerta." },
];

export default function ClientePage() {
  const { usuario } = useAuth();
  const nombre = primerNombre(usuario);
  const consulta = useConsulta(() => pedidos.listar(), [], { refrescarCadaMs: 20_000 });

  const lista = consulta.datos ?? [];
  const activos = lista.filter(estaActivo);
  const valor = (texto: string) => (consulta.cargando ? "—" : texto);

  return (
    <PanelShell area="cliente" titulo="Inicio">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Hola"
          nombre={nombre ? `Hola, ${nombre}` : "Bienvenido"}
          descripcion="Pide de tu lugar favorito y sigue cada pedido hasta que llegue a tu puerta."
          accion={
            <Link href="/cliente/menu" className={BOTON_ACENTO}>
              Ver catálogo
              {IconoFlecha}
            </Link>
          }
        />

        <AccesoPorRol />

        <section aria-label="Resumen de tu actividad" className="grid gap-4 sm:grid-cols-3">
          <Metrica
            etiqueta="Pedidos activos"
            valor={valor(String(activos.length))}
            detalle={activos.length > 0 ? "Síguelos en Mis pedidos" : "Nada en camino ahora mismo"}
            icono={IconoRuta}
            tono="marca"
          />
          <Metrica
            etiqueta="Pedidos totales"
            valor={valor(String(lista.length))}
            detalle="Desde que abriste tu cuenta"
            icono={IconoBolsa}
            tono="neutro"
          />
          <Metrica
            etiqueta="Gasto acumulado"
            valor={valor(formatearMoneda(totalVendido(lista)))}
            detalle="IVA incluido, sin cancelados"
            icono={IconoDinero}
            tono="exito"
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Tarjeta
            titulo="Tus pedidos recientes"
            descripcion="El estado de lo último que pediste"
            accion={
              lista.length > 0 && (
                <Link
                  href="/cliente/pedidos"
                  className="text-[12.5px] font-bold text-brand-700 hover:underline"
                >
                  Ver todos
                </Link>
              )
            }
          >
            {consulta.cargando ? (
              <div className="esqueleto m-5 h-32 rounded-xl" />
            ) : lista.length === 0 ? (
              <EstadoVacio
                icono={IconoReloj}
                titulo="Todavía no has pedido nada"
                descripcion="Cuando hagas tu primer pedido vas a poder seguirlo aquí paso a paso."
                accion={
                  <Link href="/cliente/menu" className={BOTON_PRIMARIO}>
                    Explorar el catálogo
                  </Link>
                }
              />
            ) : (
              <ListaPedidos
                pedidos={lista.slice(0, 5)}
                enlace={(pedido) => `/cliente/pedidos/${pedido.id}`}
              />
            )}
          </Tarjeta>

          <Tarjeta titulo="Cómo funciona" descripcion="Cuatro pasos y listo">
            <ol className="divide-y divide-line-soft">
              {PASOS.map((paso, indice) => (
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
