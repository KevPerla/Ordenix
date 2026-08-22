"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (rol === "CLIENTE") {
      router.replace("/cliente");
    } else if (rol === "ADMINISTRADOR") {
      router.replace("/empresa");
    } else if (rol === "REPARTIDOR") {
      router.replace("/repartidor");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#08090d] text-white">
      <p className="text-slate-400">
        Cargando Ordenix...
      </p>
    </main>
  );
}