import type { Metadata, Viewport } from "next";
import { Manrope, Plus_Jakarta_Sans, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const ibmPlex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FF5A5F",
};

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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" }
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`h-full ${manrope.variable} ${plusJakarta.variable} ${ibmPlex.variable}`}>
      <head>
        {/* Preconnect a dominios externos para reducir latencia DNS y SSL */}
        <link rel="preconnect" href="https://images.pexels.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />

        {/* Preload crítico del LCP Hero Image y Logo */}
        <link rel="preload" as="image" href="/hero-unidoslab.webp" type="image/webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/logo-unidoslab-opt.webp" type="image/webp" fetchPriority="high" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col antialiased font-manrope text-[#17374a]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
