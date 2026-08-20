import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "STUS Support Portal",
    template: "%s | STUS Support",
  },
  description:
    "Secure support workspace for STUS buyer and supplier conversations.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#013f92",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
