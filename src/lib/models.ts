import { Model } from "@/types/chat";

const modelColors = [
  "#ef4444", // red
  "#22c55e", // green
  "#f97316", // orange
  "#3b82f6", // blue
];

export const availableModels: Model[] = [
  {
    id: "moonshotai/kimi-k2-0905",
    name: "Kimi K2",
    shortName: "Kimi",
    provider: "moonshotai",
    color: modelColors[0],
    isActive: false,
  },
  {
    id: "google/gemini-3-pro-preview",
    name: "Gemini 3 Pro",
    shortName: "Gemini",
    provider: "google",
    color: modelColors[1],
    isActive: false,
  },
  {
    id: "anthropic/claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    shortName: "Claude",
    provider: "anthropic",
    color: modelColors[2],
    isActive: false,
  },
  {
    id: "x-ai/grok-4.1-fast",
    name: "Grok 4.1 Fast",
    shortName: "Grok",
    provider: "x-ai",
    color: modelColors[3],
    isActive: false,
  },
];
