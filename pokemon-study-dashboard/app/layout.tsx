import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trainer Study Dashboard",
  description: "A cozy pixel-art weekly study dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body style={{ fontFamily: "'Press Start 2P', cursive" }}>{children}</body>
    </html>
  );
}
