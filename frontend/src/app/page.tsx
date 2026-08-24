"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { inicioDe } from "@/lib/rutas";

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
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-[#172019]">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#DCE8DE] border-t-[#16A34A]" />
      <p className="text-[14px] font-medium text-[#718076]">
        Abriendo Ordenix
      </p>
    </main>
  );
}
