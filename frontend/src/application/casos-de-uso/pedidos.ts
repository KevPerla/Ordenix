import { resumirCarrito, type Carrito } from "@/domain/carrito";
import {
  ETIQUETA_ESTADO,
  puedeAvanzarA,
  validarDireccion,
  type EstadoPedido,
  type Pedido,
  type PedidoConfirmado,
} from "@/domain/pedido";
import { errorDeValidacion } from "../errores";
import type { PedidosRepositorio } from "../puertos/pedidos";

export interface DatosEntregaSolicitada {
  direccion: string;
  referencia: string;
  notas: string;
}

export class CasosPedidos {
  constructor(private readonly repositorio: PedidosRepositorio) {}

  confirmar(
    carrito: Carrito,
    entrega: DatosEntregaSolicitada,
  ): Promise<PedidoConfirmado> {
    if (resumirCarrito(carrito).unidades === 0) {
      throw errorDeValidacion("Agrega al menos un producto antes de confirmar");
    }

    const errorDireccion = validarDireccion(entrega.direccion);

    if (errorDireccion) {
      throw errorDeValidacion(errorDireccion);
    }

    return this.repositorio.crear({
      direccionCompleta: entrega.direccion.trim(),
      referencia: entrega.referencia.trim() || undefined,
      notas: entrega.notas.trim() || undefined,
      lineas: carrito.map((linea) => ({
        productoId: linea.productoId,
        cantidad: linea.cantidad,
      })),
    });
  }

  listar(estado?: EstadoPedido): Promise<Pedido[]> {
    return this.repositorio.listar(estado);
  }

  obtener(id: string): Promise<Pedido> {
    return this.repositorio.obtener(id);
  }

  avanzar(pedido: Pedido, destino: EstadoPedido): Promise<Pedido> {
    if (!puedeAvanzarA(pedido, destino)) {
      throw errorDeValidacion(
        `El pedido está ${ETIQUETA_ESTADO[pedido.estado].toLowerCase()} y no puede pasar a ${ETIQUETA_ESTADO[destino].toLowerCase()}`,
      );
    }

    return this.repositorio.cambiarEstado(pedido.id, destino);
  }
}
