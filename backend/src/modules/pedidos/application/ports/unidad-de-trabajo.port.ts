import type { EstadoPedido } from '../../domain/enums/estado-pedido.enum';

export const UNIDAD_DE_TRABAJO_TOKEN = Symbol('UnidadDeTrabajo');

export interface ProductoBloqueado {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  disponible: boolean;
}

export interface LineaAPersistir {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface CabeceraAPersistir {
  clienteId: string;
  direccionId: string;
  estado: EstadoPedido;
  subtotal: number;
  impuesto: number;
  total: number;
  notas: string | null;
}

export interface ContextoTransaccional {
  bloquearProductos(ids: string[]): Promise<ProductoBloqueado[]>;
  descontarStock(productoId: string, cantidad: number): Promise<void>;
  asegurarDireccion(
    clienteId: string,
    direccionCompleta: string,
    referencia: string | null,
  ): Promise<string>;
  insertarPedido(cabecera: CabeceraAPersistir): Promise<string>;
  insertarLineas(pedidoId: string, lineas: LineaAPersistir[]): Promise<void>;
  registrarCambioEstado(
    pedidoId: string,
    anterior: EstadoPedido | null,
    nuevo: EstadoPedido,
    usuarioId: string | null,
  ): Promise<void>;
}

export interface UnidadDeTrabajo {
  ejecutar<T>(
    trabajo: (contexto: ContextoTransaccional) => Promise<T>,
  ): Promise<T>;
}
