"use client";

import Link from "next/link";
import { totalVendido } from "@/domain/pedido";
import { primerNombre } from "@/domain/usuario";
import { catalogo, pedidos } from "@/infrastructure/contenedor";
import AccesoPorRol from "@/presentation/components/AccesoPorRol";
import PanelShell from "@/presentation/components/PanelShell";
import EncabezadoPanel from "@/presentation/components/panel/EncabezadoPanel";
import EstadoVacio from "@/presentation/components/panel/EstadoVacio";
import Metrica from "@/presentation/components/panel/Metrica";
import Tarjeta from "@/presentation/components/panel/Tarjeta";
import { BOTON_PRIMARIO } from "@/presentation/components/panel/estilos";
import {
  IconoBolsa,
  IconoCaja,
  IconoDinero,
  IconoReloj,
  IconoUsuarios,
} from "@/presentation/components/panel/iconos";
import ListaPedidos from "@/presentation/components/pedido/ListaPedidos";
import { useAuth } from "@/presentation/contexto/AuthContext";
import { esMismoDia } from "@/presentation/formato/fechas";
import { formatearMoneda } from "@/presentation/formato/moneda";
import { useConsulta } from "@/presentation/hooks/useConsulta";

const ACCESOS = [
  { nombre: "Productos", href: "/empresa/productos", detalle: "Catálogo, precios y existencias", icono: IconoCaja },
  { nombre: "Pedidos", href: "/empresa/pedidos", detalle: "Monitoreo y cambio de estado", icono: IconoBolsa },
  { nombre: "Usuarios", href: "/empresa/usuarios", detalle: "Cuentas y rol asignado", icono: IconoUsuarios },
];

async function cargarOperacion() {
  const [listaPedidos, listaProductos] = await Promise.all([
    pedidos.listar(),
    catalogo.productos(),
  ]);
  const ahora = new Date();
  const deHoy = listaPedidos.filter((pedido) => esMismoDia(pedido.createdAt, ahora));

  return {
    recientes: listaPedidos.slice(0, 6),
    pedidosHoy: deHoy.length,
    ventasHoy: totalVendido(deHoy),
    porAtender: listaPedidos.filter((pedido) =>
      ["CREADO", "PAGADO", "EN_PREPARACION"].includes(pedido.estado),
    ).length,
    productosActivos: listaProductos.filter((producto) => producto.disponible).length,
    agotados: listaProductos.filter((producto) => producto.disponible && producto.stock === 0)
      .length,
  };
}

export default function EmpresaPage() {
  const { usuario } = useAuth();
  const nombre = primerNombre(usuario);
  const { datos, cargando } = useConsulta(cargarOperacion, [], { refrescarCadaMs: 20_000 });

  const valor = (texto: string | number | undefined) =>
    cargando || texto === undefined ? "—" : String(texto);

  return (
    <PanelShell area="empresa" titulo="Dashboard">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Hola"
          nombre={nombre ? `Hola, ${nombre}` : "Panel de administración"}
          descripcion="Controlas el catálogo, el inventario y el ciclo de vida de cada pedido de la operación."
        />

        <AccesoPorRol />

        <section
          aria-label="Resumen de la operación"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <Metrica
            etiqueta="Pedidos hoy"
            valor={valor(datos?.pedidosHoy)}
            detalle="Confirmados por clientes"
            icono={IconoBolsa}
            tono="marca"
          />
          <Metrica
            etiqueta="Por atender"
            valor={valor(datos?.porAtender)}
            detalle="Creados, pagados o en preparación"
            icono={IconoReloj}
            tono="alerta"
          />
          <Metrica
            etiqueta="Productos activos"
            valor={valor(datos?.productosActivos)}
            detalle={
              datos && datos.agotados > 0
                ? `${datos.agotados} sin existencias`
                : "Visibles en el catálogo"
            }
            icono={IconoCaja}
            tono="neutro"
          />
          <Metrica
            etiqueta="Ventas del día"
            valor={valor(datos && formatearMoneda(datos.ventasHoy))}
            detalle="IVA incluido, sin cancelados"
            icono={IconoDinero}
            tono="exito"
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Tarjeta
            titulo="Pedidos recientes"
            descripcion="Los últimos movimientos de la operación"
            accion={
              <Link
                href="/empresa/pedidos"
                className="text-[12.5px] font-bold text-brand-700 hover:underline"
              >
                Abrir monitoreo
              </Link>
            }
          >
            {cargando ? (
              <div className="esqueleto m-5 h-32 rounded-xl" />
            ) : datos && datos.recientes.length > 0 ? (
              <ListaPedidos pedidos={datos.recientes} enlace={() => "/empresa/pedidos"} />
            ) : (
              <EstadoVacio
                icono={IconoBolsa}
                titulo="Todavía no hay pedidos"
                descripcion="Cuando un cliente confirme su primera compra aparecerá aquí con su estado."
                accion={
                  <Link href="/empresa/productos" className={BOTON_PRIMARIO}>
                    Revisar el catálogo
                  </Link>
                }
              />
            )}
          </Tarjeta>

          <Tarjeta titulo="Accesos rápidos" descripcion="Las áreas que administras">
            <ul className="divide-y divide-line-soft">
              {ACCESOS.map((acceso) => (
                <li key={acceso.href}>
                  <Link
                    href={acceso.href}
                    className="flex items-center gap-3.5 px-5 py-3.5 transition-colors duration-150 hover:bg-ink-50"
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-brand-50 text-brand-700"
                      aria-hidden="true"
                    >
                      {acceso.icono}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-bold text-ink-900">
                        {acceso.nombre}
                      </span>
                      <span className="block truncate text-[12px] text-ink-500">
                        {acceso.detalle}
                      </span>
                    </span>
                    <span className="shrink-0 text-ink-300" aria-hidden="true">
                      ›
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Tarjeta>
        </div>
      </div>
    </PanelShell>
  );
}
