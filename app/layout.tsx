import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
// On importe le bouton. Si ton dossier components est à la racine, le chemin "../components/..." est correct depuis "app/"
import ThemeToggle from "../components/ThemeToggle"; 

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {/* Le bouton s'affichera par-dessus tout le reste */}
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
