import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AvisoProvider } from "@/context/AvisoContext";

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
    <html lang="es">
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