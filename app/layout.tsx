import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Configuration de la police "Inter" (Pour l'interface et l'utilisateur)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Configuration de la police "Playfair Display" (Pour l'IA - Style Éditorial)
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Charles Bonnet - Assistant Virtuel",
  description: "Interface conversationnelle professionnelle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
