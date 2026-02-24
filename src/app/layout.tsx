import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SY Global Connect | AI 무역 플랫폼",
  description: "해외영업 실무를 위한 AI 기반 무역 솔루션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-50/30`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-white py-8 px-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
            © 2025 SY Global Connect · 해외영업 실무를 위한 AI 무역 플랫폼
          </div>
        </footer>
      </body>
    </html>
  );
}
