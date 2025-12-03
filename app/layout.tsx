// CORRECTION ICI : On utilise './' pour chercher dans le dossier app/components voisin
import RecruiterPopup from './components/RecruiterPopup'; 

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        {children}
        <RecruiterPopup />
      </body>
    </html>
  );
}
