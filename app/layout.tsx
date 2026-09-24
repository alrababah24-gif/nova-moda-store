export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import type { Metadata } from "next";
import { Inter, Tajawal } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const tajawal = Tajawal({ weight: ["400","500","700"], subsets: ["arabic"], variable: "--font-tajawal" });

export const metadata: Metadata = {
  title: "Nova Moda Abaya",
  description: "عبايات مصممة بعناية",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${inter.variable} ${tajawal.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
