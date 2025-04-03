"use client";

import { Nunito } from "next/font/google";

import "./globals.css";
import { Providers } from "@/providers";

const nunito = Nunito({ subsets: ["latin"], weight: ["700", "600"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.className} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
