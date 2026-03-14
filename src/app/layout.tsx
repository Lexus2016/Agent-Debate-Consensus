import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Debate Consensus",
  description:
    "Multi-agent debate platform — AI models discuss, argue, and find consensus while you moderate",
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
