import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secure Networking Tracker",
  description: "A private Berkeley networking contact tracker secured by Neon RLS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
