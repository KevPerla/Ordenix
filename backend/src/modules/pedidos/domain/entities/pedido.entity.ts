import {
  agregarIva,
  calcularIva,
  redondearMoneda,
} from '../../../../shared/domain/impuestos';
import {
  EstadoPedido,
  TRANSICIONES_VALIDAS,
  esEstadoFinal,
} from '../enums/estado-pedido.enum';
import { PedidoSinLineasError } from '../errors/pedido-sin-lineas.error';
import { TransicionInvalidaError } from '../errors/transicion-invalida.error';
import type { LineaPedido } from './linea-pedido.entity';

export interface DatosEntrega {
  direccion: string;
  referencia: string | null;
  cliente: string;
  telefono: string;
}

export interface CambioEstado {
  estado: EstadoPedido;
  fecha: Date;
}

export interface PropiedadesPedido {
  id: string;
  clienteId: string;
  repartidorId: string | null;
  estado: EstadoPedido;
  lineas: LineaPedido[];
  entrega: DatosEntrega;
  historial: CambioEstado[];
  notas: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Pedido {
  readonly id: string;
  readonly clienteId: string;
  readonly lineas: readonly LineaPedido[];
  readonly entrega: DatosEntrega;
  readonly historial: CambioEstado[];
  readonly notas: string | null;
  readonly createdAt: Date;
  private _estado: EstadoPedido;
  private _repartidorId: string | null;
  private _updatedAt: Date;

  constructor(propiedades: PropiedadesPedido) {
    if (propiedades.lineas.length === 0) {
      throw new PedidoSinLineasError();
    }

    this.id = propiedades.id;
    this.clienteId = propiedades.clienteId;
    this.lineas = propiedades.lineas;
    this.entrega = propiedades.entrega;
    this.historial = propiedades.historial;
    this.notas = propiedades.notas;
    this.createdAt = propiedades.createdAt;
    this._estado = propiedades.estado;
    this._repartidorId = propiedades.repartidorId;
    this._updatedAt = propiedades.updatedAt;
  }

  get estado(): EstadoPedido {
    return this._estado;
  }

  get repartidorId(): string | null {
    return this._repartidorId;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get subtotal(): number {
    return redondearMoneda(
      this.lineas.reduce((total, linea) => total + linea.subtotal, 0),
    );
  }

  get impuesto(): number {
    return calcularIva(this.subtotal);
  }

  get total(): number {
    return agregarIva(this.subtotal);
  }

  get unidades(): number {
    return this.lineas.reduce((total, linea) => total + linea.cantidad, 0);
  }

  puedeTransicionarA(destino: EstadoPedido): boolean {
    return TRANSICIONES_VALIDAS[this._estado].includes(destino);
  }

  transicionesPosibles(): readonly EstadoPedido[] {
    return TRANSICIONES_VALIDAS[this._estado];
  }

  estaCerrado(): boolean {
    return esEstadoFinal(this._estado);
  }

  cambiarEstado(destino: EstadoPedido): EstadoPedido {
    if (!this.puedeTransicionarA(destino)) {
      throw new TransicionInvalidaError(
        this._estado,
        destino,
        this.transicionesPosibles(),
      );
    }

    const anterior = this._estado;
    const ahora = new Date();

    this._estado = destino;
    this._updatedAt = ahora;
    this.historial.push({ estado: destino, fecha: ahora });

    return anterior;
  }

  asignarRepartidor(repartidorId: string): void {
    this._repartidorId = repartidorId;
    this._updatedAt = new Date();
  }
}
