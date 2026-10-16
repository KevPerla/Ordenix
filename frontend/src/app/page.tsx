"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/contexto/AuthContext";
import { inicioDe } from "@/presentation/navegacion/rutas";

export default function HomePage() {
  const router = useRouter();
  const { usuario, cargandoSesion } = useAuth();

  useEffect(() => {
    if (cargandoSesion) {
      return;
    }

    router.replace(usuario ? inicioDe(usuario.rol) : "/login");
  }, [cargandoSesion, usuario, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-[#0F172A]">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#E2E8F0] border-t-[#2563EB]" />
      <p className="text-[14px] font-medium text-[#64748B]">
        Abriendo Ordenix
      </p>
    </main>
  );
}
