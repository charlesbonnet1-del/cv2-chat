import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Charles Bonnet",
  description: "charlesbonnet.xyz — digital clone · ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Instrument+Serif:ital@1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
