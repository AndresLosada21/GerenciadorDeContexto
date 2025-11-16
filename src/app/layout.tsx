import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Markdown Assembler - Contexto Perfeito para IAs",
  description: "Transforme seu projeto em Markdown otimizado para Claude, ChatGPT e Copilot. Sem copiar/colar manual. 100% local e gratuito.",
  icons: {
    icon: "/Ico/Ico.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        {/* Google Fonts (Space Mono) */}
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
