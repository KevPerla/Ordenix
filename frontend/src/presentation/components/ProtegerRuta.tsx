"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/contexto/AuthContext";
import { inicioDe } from "@/presentation/navegacion/rutas";
import type { Rol } from "@/domain/usuario";

interface ProtegerRutaProps {
  rol: Rol;
  children: ReactNode;
}

function Cargando() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-6">
      <div className="w-full max-w-md space-y-4">
        <div className="h-10 w-2/5 animate-pulse rounded-2xl bg-[#E2E8F0]" />
        <div className="h-4 w-3/5 animate-pulse rounded-full bg-[#EEF2F7]" />
        <div className="h-40 w-full animate-pulse rounded-[28px] bg-[#EEF2F7]" />
      </div>
    </div>
  );
}

export default function ProtegerRuta({ rol, children }: ProtegerRutaProps) {
  const { usuario, cargandoSesion } = useAuth();
  const router = useRouter();

  const autorizado = Boolean(usuario) && usuario?.rol === rol;

  useEffect(() => {
    if (cargandoSesion) {
      return;
    }

    if (!usuario) {
      router.replace("/login");
      return;
    }

    if (usuario.rol !== rol) {
      router.replace(inicioDe(usuario.rol));
    }
  }, [cargandoSesion, usuario, rol, router]);

  if (cargandoSesion || !autorizado) {
    return <Cargando />;
  }

  return <>{children}</>;
}
