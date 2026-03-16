import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const seasonMix = localFont({
  src: "../public/fonts/seasonmix/SeasonMix-TRIAL-Light.otf",
  variable: "--font-season-mix",
  weight: "100",
  display: "swap",
  preload: true,
});

const matter = localFont({
  src: "../public/fonts/matter/Matter-TRIAL-Regular.otf",
  variable: "--font-matter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "HomeGuru - Dashboard",
  description: "Your perfect tutor, matched by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${seasonMix.variable} ${matter.variable} antialiased`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
