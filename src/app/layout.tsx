import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ZERO FIRE - Pare de Fumar",
  description: "App premium para ajudar você a parar de fumar com design minimalista e gamificação",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${geistMono.variable} font-inter antialiased bg-[#0D0D0D] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
