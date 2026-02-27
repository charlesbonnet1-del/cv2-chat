import RecruiterPopup from './components/RecruiterPopup';
import type { Metadata } from "next";
import { DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
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
      <body className={dmSerifDisplay.className}>
        {children}
        <RecruiterPopup />
      </body>
    </html>
  );
}

