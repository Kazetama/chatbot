import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "War Comment Lab – Simulator Etika Digital",
  description:
    "Simulator interaktif etika bermedia sosial berbasis Pancasila. Hadapi provokasi, latih empati, dan buktikan kamu netizen yang bijak.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen bg-background antialiased">{children}</body>
    </html>
  );
}
