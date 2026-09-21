import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sun3D — Customizable Household Nameplates | Modern Acrylic, Teak & Brass",
  description:
    "Design, customize, and order premium physical household nameplates online. Curated architect templates, real-time preview, 5:3, 4:2, and 4:3 ratios, with doorstep delivery across Bangladesh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-zinc-950 text-neutral-900 dark:text-neutral-100">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
