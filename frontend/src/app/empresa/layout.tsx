import type { ReactNode } from "react";
import ProtegerRuta from "@/presentation/components/ProtegerRuta";

export default function EmpresaLayout({ children }: { children: ReactNode }) {
  return <ProtegerRuta rol="ADMINISTRADOR">{children}</ProtegerRuta>;
}
