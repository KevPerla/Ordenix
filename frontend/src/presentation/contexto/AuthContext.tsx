"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Credenciales, DatosRegistro, Rol, Usuario } from "@/domain/usuario";
import { autenticacion } from "@/infrastructure/contenedor";

interface AuthContextType {
  usuario: Usuario | null;
  cargandoSesion: boolean;
  iniciarSesion: (credenciales: Credenciales) => Promise<Usuario>;
  registrarse: (datos: DatosRegistro) => Promise<Usuario>;
  cerrarSesion: () => void;
  tieneRol: (rol: Rol) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    let vigente = true;

    autenticacion
      .restaurarSesion()
      .catch(() => null)
      .then((restaurado) => {
        if (!vigente) return;
        setUsuario(restaurado);
        setCargandoSesion(false);
      });

    return () => {
      vigente = false;
    };
  }, []);

  async function iniciarSesion(credenciales: Credenciales): Promise<Usuario> {
    const nuevo = await autenticacion.iniciarSesion(credenciales);
    setUsuario(nuevo);
    return nuevo;
  }

  async function registrarse(datos: DatosRegistro): Promise<Usuario> {
    const nuevo = await autenticacion.registrarse(datos);
    setUsuario(nuevo);
    return nuevo;
  }

  function cerrarSesion() {
    autenticacion.cerrarSesion();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargandoSesion,
        iniciarSesion,
        registrarse,
        cerrarSesion,
        tieneRol: (rol) => usuario?.rol === rol,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }

  return context;
}
