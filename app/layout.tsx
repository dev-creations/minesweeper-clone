import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minesweeper Clone",
  description: "Simple Minesweeper Clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
