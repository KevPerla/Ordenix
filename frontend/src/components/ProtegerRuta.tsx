"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { inicioDe } from "@/lib/rutas";
import type { Rol } from "@/types/auth";

interface ProtegerRutaProps {
  rol: Rol;
  children: ReactNode;
}

function Cargando() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-6">
      <div className="w-full max-w-md space-y-4">
        <div className="h-10 w-2/5 animate-pulse rounded-2xl bg-[#E3EFE5]" />
        <div className="h-4 w-3/5 animate-pulse rounded-full bg-[#EAF3EB]" />
        <div className="h-40 w-full animate-pulse rounded-[28px] bg-[#EAF3EB]" />
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
