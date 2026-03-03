import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snapdesk Hub – Votre espace personnel",
  description:
    "Portail Snapdesk pour propriétaires d'espaces de bureaux et entreprises en recherche.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased bg-slate-50" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
