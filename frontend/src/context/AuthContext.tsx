"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ACCESS_TOKEN_KEY,
  ApiError,
  getMe,
} from "@/lib/api";
import type { Rol, Usuario } from "@/types/auth";

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  cargandoSesion: boolean;
  iniciarSesion: (
    usuario: Usuario,
    accessToken: string
  ) => void;
  cerrarSesion: () => void;
  tieneRol: (rol: Rol) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    let activo = true;

    async function restaurarSesion() {
      const accessToken = window.localStorage.getItem(
        ACCESS_TOKEN_KEY
      );

      if (!accessToken) {
        if (activo) {
          setCargandoSesion(false);
        }
        return;
      }

      if (activo) {
        setToken(accessToken);
      }

      try {
        const usuarioRestaurado = await getMe();

        if (activo) {
          setUsuario(usuarioRestaurado);
        }
      } catch (error: unknown) {
        if (error instanceof ApiError && error.status === 401) {
          window.localStorage.removeItem(ACCESS_TOKEN_KEY);

          if (activo) {
            setToken(null);
          }
        }

        if (activo) {
          setUsuario(null);
        }
      } finally {
        if (activo) {
          setCargandoSesion(false);
        }
      }
    }

    void restaurarSesion();

    return () => {
      activo = false;
    };
  }, []);

  const iniciarSesion = (
    nuevoUsuario: Usuario,
    accessToken: string
  ) => {
    window.localStorage.setItem(
      ACCESS_TOKEN_KEY,
      accessToken
    );
    setUsuario(nuevoUsuario);
    setToken(accessToken);
  };

  const cerrarSesion = () => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    setUsuario(null);
    setToken(null);
  };

  const tieneRol = (rol: Rol) => {
    return usuario?.rol === rol;
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        cargandoSesion,
        iniciarSesion,
        cerrarSesion,
        tieneRol,
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
