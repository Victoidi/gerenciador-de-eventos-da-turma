import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gerenciador de Eventos da Turma",
  description: "Publicacoes escolares da turma com painel administrativo protegido.",
  icons: {
    icon: "/app-icon.png",
    apple: "/app-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
