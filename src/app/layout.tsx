import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tá Rodando?",
  description:
    "Monitor de GitHub Actions e workflows N8N da Moon Ventures. Alerta falhas silenciosas no WhatsApp antes que alguém reclame.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
