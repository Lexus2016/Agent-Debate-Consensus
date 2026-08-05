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
  title: "Agent Debate — several AI models discuss your question",
  description:
    "Ask one question and up to eight AI models discuss it with each other, live. They read each other's answers, disagree, and one of them sums up at the end. You moderate, or hand the role to a model.",
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
    title: "Agent Debate — several AI models discuss your question",
    description:
      "Ask one question and up to eight AI models argue it out, live. You read the reasoning instead of a single verdict.",
    url: "https://lryq.com",
    siteName: "Agent Debate",
    type: "website",
    locale: "en_US",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Agent Debate" }],
  },
  twitter: {
    card: "summary",
    title: "Agent Debate — several AI models discuss your question",
    description:
      "Ask one question and up to eight AI models argue it out, live. You read the reasoning instead of a single verdict.",
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
