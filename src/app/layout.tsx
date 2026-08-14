import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNIDOSLAB - Unidos por tu Salud",
  description: "Sistema de Operaciones Clínicas y Portal de Resultados UNIDOSLAB",
  icons: {
    icon: "/icon-unidoslab.png",
  },
  openGraph: {
    title: "UNIDOSLAB - Unidos por tu Salud",
    description: "Sistema de Operaciones Clínicas y Portal de Resultados UNIDOSLAB",
    siteName: "UNIDOSLAB",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNIDOSLAB - Unidos por tu Salud",
    description: "Sistema de Operaciones Clínicas y Portal de Resultados UNIDOSLAB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
