import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/presentation/contexto/AuthContext";
import { AvisoProvider } from "@/presentation/contexto/AvisoContext";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--fuente-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Ordenix",
  description: "Plataforma de gestión y delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body>
        <AvisoProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AvisoProvider>
      </body>
    </html>
  );
}
