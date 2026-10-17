"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { mensajeDeError } from "@/application/errores";
import {
  ivaUnitario,
  precioConIva,
  subtotalLinea,
} from "@/domain/carrito";
import { validarDireccion } from "@/domain/pedido";
import { catalogo, pedidos } from "@/infrastructure/contenedor";
import ControlCantidad from "@/presentation/components/carrito/ControlCantidad";
import PanelShell from "@/presentation/components/PanelShell";
import Campo, { CLASES_CONTROL } from "@/presentation/components/panel/Campo";
import EncabezadoPanel from "@/presentation/components/panel/EncabezadoPanel";
import EstadoVacio from "@/presentation/components/panel/EstadoVacio";
import Tarjeta from "@/presentation/components/panel/Tarjeta";
import { BOTON_ACENTO, BOTON_PRIMARIO } from "@/presentation/components/panel/estilos";
import { IconoBasura, IconoCarrito } from "@/presentation/components/panel/iconos";
import { useAviso } from "@/presentation/contexto/AvisoContext";
import { formatearMoneda } from "@/presentation/formato/moneda";
import { useCarrito } from "@/presentation/hooks/useCarrito";
import { useConsulta } from "@/presentation/hooks/useConsulta";

export default function ClienteCarritoPage() {
  const router = useRouter();
  const { mostrarAviso } = useAviso();
  const carrito = useCarrito();

  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [notas, setNotas] = useState("");
  const [errorDireccion, setErrorDireccion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const vigentes = useConsulta(() => catalogo.catalogoDelCliente(), []);
  const historial = useConsulta(() => pedidos.listar(), []);
  const ultimaEntrega = historial.datos?.[0]?.entrega;

  const { sincronizar } = carrito;
  useEffect(() => {
    if (vigentes.datos) sincronizar(vigentes.datos);
  }, [vigentes.datos, sincronizar]);

  async function confirmar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    const problema = validarDireccion(direccion);
    setErrorDireccion(problema);
    if (problema) return;

    setEnviando(true);

    try {
      const pedido = await pedidos.confirmar(carrito.lineas, {
        direccion,
        referencia,
        notas,
      });

      carrito.vaciar();
      mostrarAviso("Pedido confirmado");
      router.push(`/cliente/pedidos/${pedido.id}`);
    } catch (fallo: unknown) {
      setError(mensajeDeError(fallo, "No se pudo confirmar el pedido"));
      vigentes.recargar();
      setEnviando(false);
    }
  }

  const { lineas, resumen } = carrito;

  return (
    <PanelShell area="cliente" titulo="Carrito">
      <div className="space-y-6">
        <EncabezadoPanel
          saludo="Carrito"
          nombre="Revisa tu pedido"
          descripcion="Ajusta cantidades, confirma la dirección y paga en efectivo cuando llegue el repartidor."
        />

        {lineas.length === 0 ? (
          <Tarjeta>
            <EstadoVacio
              icono={IconoCarrito}
              titulo="Tu carrito está vacío"
              descripcion="Agrega productos desde el catálogo y vuelve aquí para confirmar el pedido."
              accion={
                <Link href="/cliente/menu" className={BOTON_PRIMARIO}>
                  Ir al catálogo
                </Link>
              }
            />
          </Tarjeta>
        ) : (
          <div className="grid items-start gap-6 2xl:grid-cols-[1.6fr_1fr]">
            <Tarjeta
              titulo="Productos"
              descripcion={`${resumen.unidades} ${resumen.unidades === 1 ? "unidad" : "unidades"}`}
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left">
                  <thead>
                    <tr className="border-b border-line-soft text-[11.5px] font-bold uppercase tracking-[0.06em] text-ink-500">
                      <th className="px-5 py-3">Producto</th>
                      <th className="px-3 py-3 text-right">Precio sin IVA</th>
                      <th className="px-3 py-3 text-right">IVA 13%</th>
                      <th className="px-3 py-3 text-right">Precio con IVA</th>
                      <th className="px-3 py-3 text-center">Cantidad</th>
                      <th className="px-3 py-3 text-right">Subtotal</th>
                      <th className="px-5 py-3">
                        <span className="sr-only">Quitar</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-line-soft">
                    {lineas.map((linea) => (
                      <tr key={linea.productoId} className="text-[13.5px]">
                        <td className="px-5 py-3">
                          <p className="font-bold text-ink-900">{linea.nombre}</p>
                          <p className="text-[12px] text-ink-500">
                            {linea.stock} en existencia
                          </p>
                        </td>
                        <td className="numero-tabular px-3 py-3 text-right text-ink-700">
                          {formatearMoneda(linea.precioSinIva)}
                        </td>
                        <td className="numero-tabular px-3 py-3 text-right text-ink-500">
                          {formatearMoneda(ivaUnitario(linea))}
                        </td>
                        <td className="numero-tabular px-3 py-3 text-right font-semibold text-ink-900">
                          {formatearMoneda(precioConIva(linea))}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <ControlCantidad
                            nombre={linea.nombre}
                            cantidad={linea.cantidad}
                            maximo={linea.stock}
                            alCambiar={(cantidad) =>
                              carrito.cambiarCantidad(linea.productoId, cantidad)
                            }
                          />
                        </td>
                        <td className="numero-tabular px-3 py-3 text-right font-bold text-ink-900">
                          {formatearMoneda(subtotalLinea(linea))}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            type="button"
                            aria-label={`Quitar ${linea.nombre} del carrito`}
                            onClick={() => carrito.quitar(linea.productoId)}
                            className="presionable grid h-9 w-9 place-items-center rounded-[10px] text-ink-400 hover:bg-red-50 hover:text-red-600"
                          >
                            {IconoBasura}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tarjeta>

            <Tarjeta titulo="Entrega y pago" descripcion="Pago en efectivo contra entrega">
              <form onSubmit={confirmar} noValidate className="space-y-4 p-5">
                <Campo
                  etiqueta="Dirección de entrega"
                  htmlFor="direccion"
                  error={errorDireccion ?? undefined}
                >
                  <textarea
                    id="direccion"
                    rows={2}
                    value={direccion}
                    onChange={(evento) => {
                      setDireccion(evento.target.value);
                      if (errorDireccion) setErrorDireccion(null);
                    }}
                    placeholder="Colonia, calle, número de casa"
                    autoComplete="street-address"
                    className={`${CLASES_CONTROL} h-auto resize-none py-2.5`}
                  />
                </Campo>

                {ultimaEntrega && direccion !== ultimaEntrega.direccion && (
                  <button
                    type="button"
                    onClick={() => {
                      setDireccion(ultimaEntrega.direccion);
                      setReferencia(ultimaEntrega.referencia ?? "");
                      setErrorDireccion(null);
                    }}
                    className="-mt-2 text-left text-[12.5px] font-semibold text-brand-700 hover:underline"
                  >
                    Usar mi última dirección: {ultimaEntrega.direccion}
                  </button>
                )}

                <Campo etiqueta="Punto de referencia" htmlFor="referencia" ayuda="Opcional">
                  <input
                    id="referencia"
                    value={referencia}
                    onChange={(evento) => setReferencia(evento.target.value)}
                    placeholder="Portón negro, frente al parque"
                    className={CLASES_CONTROL}
                  />
                </Campo>

                <Campo etiqueta="Notas para el negocio" htmlFor="notas" ayuda="Opcional">
                  <input
                    id="notas"
                    value={notas}
                    onChange={(evento) => setNotas(evento.target.value)}
                    placeholder="Sin cebolla, cambio de $20"
                    className={CLASES_CONTROL}
                  />
                </Campo>

                <dl className="space-y-1.5 border-t border-line-soft pt-4 text-[13.5px]">
                  <div className="flex justify-between">
                    <dt className="text-ink-500">Subtotal sin IVA</dt>
                    <dd className="numero-tabular font-semibold text-ink-700">
                      {formatearMoneda(resumen.subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-500">IVA 13%</dt>
                    <dd className="numero-tabular font-semibold text-ink-700">
                      {formatearMoneda(resumen.iva)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <dt className="font-bold text-ink-900">Total a pagar</dt>
                    <dd className="numero-tabular text-[24px] font-extrabold tracking-[-0.03em] text-brand-700">
                      {formatearMoneda(resumen.total)}
                    </dd>
                  </div>
                </dl>

                {error && (
                  <p
                    role="alert"
                    className="rounded-[var(--radius-control)] border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] font-medium text-red-700"
                  >
                    {error}
                  </p>
                )}

                <button type="submit" disabled={enviando} className={`${BOTON_ACENTO} w-full`}>
                  {enviando ? "Confirmando pedido" : "Confirmar pedido"}
                </button>
              </form>
            </Tarjeta>
          </div>
        )}
      </div>
    </PanelShell>
  );
}
