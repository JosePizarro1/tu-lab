import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AquaLab - Clinical Operations",
  description: "Sistema interno y portal clínico de AquaLab",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="30" y="10" width="40" height="60" rx="6" fill="%231A8BC6"/><rect x="34" y="44" width="32" height="22" rx="4" fill="%233BB5E8"/><rect x="34" y="18" width="32" height="22" rx="4" fill="%233BB5E8" opacity="0.7"/><rect x="40" y="6" width="20" height="12" rx="3" fill="%231A8BC6"/></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
  openGraph: {
    title: "AquaLab - Clinical Operations",
    description: "Sistema interno y portal clínico de AquaLab",
    siteName: "AquaLab",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AquaLab - Clinical Operations",
    description: "Sistema interno y portal clínico de AquaLab",
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
