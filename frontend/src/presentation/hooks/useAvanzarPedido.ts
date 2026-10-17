"use client";

import { useState } from "react";
import { mensajeDeError } from "@/application/errores";
import {
  ETIQUETA_ESTADO,
  folio,
  type EstadoPedido,
  type Pedido,
} from "@/domain/pedido";
import { pedidos } from "@/infrastructure/contenedor";
import { useAviso } from "@/presentation/contexto/AvisoContext";

export function useAvanzarPedido(alTerminar: () => void) {
  const { mostrarAviso } = useAviso();
  const [ocupado, setOcupado] = useState<string | null>(null);

  async function avanzar(pedido: Pedido, destino: EstadoPedido) {
    setOcupado(pedido.id);

    try {
      await pedidos.avanzar(pedido, destino);
      mostrarAviso(`${folio(pedido)} ahora está ${ETIQUETA_ESTADO[destino].toLowerCase()}`);
    } catch (error: unknown) {
      mostrarAviso(mensajeDeError(error, "No se pudo cambiar el estado"), "error");
    } finally {
      setOcupado(null);
      alTerminar();
    }
  }

  return { avanzar, ocupado };
}
