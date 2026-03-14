import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lryq.com"),
  title: "Agent Debate — Multi-Agent AI Debate Platform",
  description:
    "Pick 2–5 AI models, pose a question, and watch them argue in real time. Steer the discussion and drive toward consensus. Powered by OpenRouter.",
  keywords: [
    "AI debate",
    "multi-agent AI",
    "LLM debate",
    "AI consensus",
    "OpenRouter",
    "multi-model chat",
    "agent debate",
    "GPT-4 vs Claude",
    "AI comparison tool",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Agent Debate — Multi-Agent AI Debate Platform",
    description:
      "Pick 2–5 AI models, pose a question, and watch them argue in real time. Steer the discussion and drive toward consensus.",
    url: "https://lryq.com",
    siteName: "Agent Debate",
    type: "website",
    locale: "en_US",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Agent Debate" }],
  },
  twitter: {
    card: "summary",
    title: "Agent Debate — Multi-Agent AI Debate Platform",
    description:
      "Pick 2–5 AI models, pose a question, and watch them argue in real time. Steer the discussion and drive toward consensus.",
    images: ["/icon-512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme by reading persisted state before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=JSON.parse(localStorage.getItem("chat-storage")||"{}");var t=s&&s.state&&s.state.theme||"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
