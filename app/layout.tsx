"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./SessionWrapper";
import { Providers } from "./providers";
import NavbarMain from "./components/NavbarMain";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/clipsifyLogo.png" type="image/png" />
        <title>Clipsify</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper>
          <NavbarMain />
          {children}
          {/* Only show footer on non-dashboard pages */}
          {!isDashboard && <Footer />}
        </SessionWrapper>
      </body>
    </html>
  );
}
