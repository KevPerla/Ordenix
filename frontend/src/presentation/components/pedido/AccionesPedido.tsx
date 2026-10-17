"use client";

import { useState } from "react";
import {
  ACCION_HACIA,
  folio,
  type EstadoPedido,
  type Pedido,
} from "@/domain/pedido";
import Dialogo from "@/presentation/components/panel/Dialogo";
import {
  BOTON_PELIGRO,
  BOTON_PRIMARIO,
  BOTON_SECUNDARIO,
} from "@/presentation/components/panel/estilos";

interface AccionesPedidoProps {
  pedido: Pedido;
  permitidos?: readonly EstadoPedido[];
  ocupado: boolean;
  alAvanzar: (destino: EstadoPedido) => void;
}

export default function AccionesPedido({
  pedido,
  permitidos,
  ocupado,
  alAvanzar,
}: AccionesPedidoProps) {
  const [confirmandoCancelacion, setConfirmandoCancelacion] = useState(false);

  const destinos = pedido.estadosPosibles.filter(
    (destino) => !permitidos || permitidos.includes(destino),
  );

  if (destinos.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {destinos.map((destino) =>
        destino === "CANCELADO" ? (
          <button
            key={destino}
            type="button"
            disabled={ocupado}
            onClick={() => setConfirmandoCancelacion(true)}
            className={BOTON_PELIGRO}
          >
            {ACCION_HACIA[destino]}
          </button>
        ) : (
          <button
            key={destino}
            type="button"
            disabled={ocupado}
            onClick={() => alAvanzar(destino)}
            className={BOTON_PRIMARIO}
          >
            {ACCION_HACIA[destino]}
          </button>
        ),
      )}

      <Dialogo
        abierto={confirmandoCancelacion}
        onCerrar={() => setConfirmandoCancelacion(false)}
        titulo={`¿Cancelar el pedido ${folio(pedido)}?`}
        descripcion="El pedido queda cerrado y ya no podrá avanzar. Esta acción no se puede deshacer."
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setConfirmandoCancelacion(false)}
            className={`${BOTON_SECUNDARIO} flex-1`}
          >
            Mantener pedido
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmandoCancelacion(false);
              alAvanzar("CANCELADO");
            }}
            className="presionable inline-flex h-11 flex-1 items-center justify-center rounded-[var(--radius-control)] bg-red-600 px-5 text-[14px] font-bold text-white hover:bg-red-700"
          >
            Cancelar pedido
          </button>
        </div>
      </Dialogo>
    </div>
  );
}
