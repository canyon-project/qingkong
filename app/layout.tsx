import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React19Compat from "./components/React19Compat";
import PWAInstaller from "./components/PWAInstaller";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "晴空单向历",
  description: "记录每一天的美好",
  manifest: "/manifest.json",
  themeColor: "#FF2442",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "晴空单向历",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <React19Compat />
        {children}
        <PWAInstaller />
      </body>
    </html>
  );
}
