"use client";

import { useState, type ReactNode } from "react";
import Navbar from "@/presentation/components/Navbar";
import Sidebar, { type Area } from "@/presentation/components/Sidebar";

interface PanelShellProps {
  area: Area;
  titulo: string;
  children: ReactNode;
}

export default function PanelShell({ area, titulo, children }: PanelShellProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-ink-900">
      <Sidebar
        role={area}
        abierto={menuAbierto}
        onCerrar={() => setMenuAbierto(false)}
      />

      <div className="min-h-screen lg:ml-[280px]">
        <Navbar title={titulo} onAbrirMenu={() => setMenuAbierto(true)} />

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
