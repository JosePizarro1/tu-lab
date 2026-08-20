import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tu-lab.vercel.app"),
  title: {
    default: "UNIDOSLAB | Laboratorio Clínico y Análisis en Tacna",
    template: "%s | UNIDOSLAB Tacna"
  },
  description: "Laboratorio de análisis clínicos y diagnóstico de alta precisión en Tacna. Toma de muestras en sede y a domicilio, ecografías y consulta médica con entrega rápida de resultados en línea.",
  keywords: [
    "UNIDOSLAB",
    "Laboratorio Clínico Tacna",
    "Análisis de sangre Tacna",
    "Resultados en línea Tacna",
    "Toma de muestras a domicilio Tacna",
    "Ecografías Tacna",
    "Pruebas de laboratorio Tacna",
    "Laboratorio Unidoslab"
  ],
  authors: [{ name: "UNIDOSLAB" }],
  creator: "UNIDOSLAB",
  publisher: "UNIDOSLAB",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon-unidoslab.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" }
    ],
    shortcut: "/icon-unidoslab.png",
    apple: "/icon-unidoslab.png",
  },
  openGraph: {
    title: "UNIDOSLAB | Laboratorio Clínico y Análisis en Tacna",
    description: "Diagnóstico oportuno, tecnología automatizada de alta precisión y entrega de resultados en línea en Tacna. Sedes en Av. Leguía y Patricio Meléndez.",
    url: "https://tu-lab.vercel.app",
    siteName: "UNIDOSLAB - Unidos por tu Salud",
    images: [
      {
        url: "/logo-unidoslab.png",
        width: 800,
        height: 600,
        alt: "UNIDOSLAB - Laboratorio Clínico Tacna",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNIDOSLAB | Laboratorio Clínico en Tacna",
    description: "Resultados certeros, tecnología automatizada y atención personalizada a domicilio y en sedes.",
    images: ["/logo-unidoslab.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  themeColor: "#FF5A5F",
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
