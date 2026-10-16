import type { AlmacenCarrito } from "@/application/puertos/carrito";
import { CARRITO_VACIO, type Carrito, type LineaCarrito } from "@/domain/carrito";

const PREFIJO = "ordenix_carrito_";

function esLinea(valor: unknown): valor is LineaCarrito {
  if (typeof valor !== "object" || valor === null) {
    return false;
  }

  const linea = valor as Record<string, unknown>;

  return (
    typeof linea.productoId === "string" &&
    typeof linea.nombre === "string" &&
    typeof linea.precioSinIva === "number" &&
    typeof linea.stock === "number" &&
    typeof linea.cantidad === "number"
  );
}

export class CarritoNavegador implements AlmacenCarrito {
  private readonly cache = new Map<string, { crudo: string | null; carrito: Carrito }>();
  private readonly oyentes = new Set<() => void>();

  leer(propietario: string): Carrito {
    const crudo = this.leerCrudo(propietario);
    const enCache = this.cache.get(propietario);

    if (enCache && enCache.crudo === crudo) {
      return enCache.carrito;
    }

    const carrito = this.interpretar(crudo);
    this.cache.set(propietario, { crudo, carrito });
    return carrito;
  }

  guardar(propietario: string, carrito: Carrito): void {
    try {
      window.localStorage.setItem(PREFIJO + propietario, JSON.stringify(carrito));
    } catch {
      this.cache.set(propietario, { crudo: null, carrito });
    }

    this.oyentes.forEach((oyente) => oyente());
  }

  suscribir(alCambiar: () => void): () => void {
    const alCambiarEnOtraPestana = (evento: StorageEvent) => {
      if (evento.key?.startsWith(PREFIJO)) alCambiar();
    };

    this.oyentes.add(alCambiar);
    window.addEventListener("storage", alCambiarEnOtraPestana);

    return () => {
      this.oyentes.delete(alCambiar);
      window.removeEventListener("storage", alCambiarEnOtraPestana);
    };
  }

  private leerCrudo(propietario: string): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return window.localStorage.getItem(PREFIJO + propietario);
    } catch {
      return this.cache.get(propietario)?.crudo ?? null;
    }
  }

  private interpretar(crudo: string | null): Carrito {
    if (!crudo) {
      return CARRITO_VACIO;
    }

    try {
      const valor: unknown = JSON.parse(crudo);
      return Array.isArray(valor) ? valor.filter(esLinea) : CARRITO_VACIO;
    } catch {
      return CARRITO_VACIO;
    }
  }
}
