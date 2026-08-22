"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Rol, Usuario } from "@/types/auth";

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  iniciarSesion: (usuario: Usuario, token?: string) => void;
  cerrarSesion: () => void;
  tieneRol: (rol: Rol) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const iniciarSesion = (usuario: Usuario, token?: string) => {
    setUsuario(usuario);
    setToken(token ?? null);
  };

  const cerrarSesion = () => {
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