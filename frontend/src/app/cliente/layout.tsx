import type { ReactNode } from "react";
import ProtegerRuta from "@/presentation/components/ProtegerRuta";

export default function ClienteLayout({ children }: { children: ReactNode }) {
  return <ProtegerRuta rol="CLIENTE">{children}</ProtegerRuta>;
}
