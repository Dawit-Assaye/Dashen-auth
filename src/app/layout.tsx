import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const nunito = Nunito({ subsets: ["latin"], weight: ["700", "600"] });

export const metadata = {
  title: "Dashen Super App Dashboard",
  description: "Dashboard for Dashen Bank",
  icons: {
    icon: "/dashen_logo.png",
    apple: "/dashen_logo.png",
  },
};

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
