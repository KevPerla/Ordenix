import type { ReactNode } from "react";
import ProtegerRuta from "@/components/ProtegerRuta";

export default function RepartidorLayout({ children }: { children: ReactNode }) {
  return <ProtegerRuta rol="REPARTIDOR">{children}</ProtegerRuta>;
}
