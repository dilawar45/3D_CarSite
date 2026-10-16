import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apex Automotive | 3D Interactive Car Showroom",
  description:
    "Explore the 2024+ Toyota Land Cruiser Prado J250, Executive Sedan, and Sport Hatchback with scroll-driven exploded-view disassembly, 360° OrbitControls, and interactive engineering specifications.",
  keywords: [
    "Toyota Land Cruiser Prado J250",
    "3D Car Showroom",
    "WebGL",
    "Three.js",
    "React Three Fiber",
    "Exploded View",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="bg-[#07090e] text-[#F1F5F9] antialiased selection:bg-[#C9A96E]/30 selection:text-white">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
