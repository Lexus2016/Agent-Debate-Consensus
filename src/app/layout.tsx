import type { Metadata } from "next";
import { Fraunces, Spectral, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-fraunces",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-spectral",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lryq.com"),
  title: "Agent Debate — Multi-Agent AI Debate Platform",
  description:
    "Put 2–5 AI models in one room. Pose a question. Watch them argue in real time. You moderate, steer, and drive toward consensus.",
  keywords: [
    "AI debate",
    "multi-agent AI",
    "LLM debate",
    "AI consensus",
    "OpenRouter",
    "multi-model chat",
    "agent debate",
    "GPT vs Claude",
    "AI comparison tool",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Agent Debate — Multi-Agent AI Debate Platform",
    description:
      "Put 2–5 AI models in one room. Pose a question. Watch them argue. You moderate.",
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
      "Put 2–5 AI models in one room. Pose a question. Watch them argue. You moderate.",
    images: ["/icon-512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${fraunces.variable} ${spectral.variable} ${jetbrains.variable}`}
    >
      <head>
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
