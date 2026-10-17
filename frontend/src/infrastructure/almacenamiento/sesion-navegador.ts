import type { AlmacenSesion } from "@/application/puertos/autenticacion";

const CLAVE = "ordenix_access_token";

export class SesionNavegador implements AlmacenSesion {
  leer(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      return window.localStorage.getItem(CLAVE);
    } catch {
      return null;
    }
  }

  guardar(token: string): void {
    try {
      window.localStorage.setItem(CLAVE, token);
    } catch {}
  }

  borrar(): void {
    try {
      window.localStorage.removeItem(CLAVE);
    } catch {}
  }
}
