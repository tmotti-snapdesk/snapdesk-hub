import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Snapdesk Hub – Votre espace personnel",
  description:
    "Portail Snapdesk pour propriétaires d'espaces de bureaux.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased bg-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
