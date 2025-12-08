import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Group Chat",
  description: "Chat with multiple AI models at once",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
