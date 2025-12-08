"use client";

import { Message, Model } from "@/types/chat";
import { useChatStore } from "@/store/chatStore";
import { useMemo } from "react";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const activeModels = useChatStore((state) => state.activeModels);
  const availableModels = useChatStore((state) => state.availableModels);
  const isUser = message.role === "user";
  const model = [...activeModels, ...availableModels].find(
    (m) => m.id === message.modelId
  );

  // Parse and highlight @mentions
  const formattedContent = useMemo(() => {
    const allModels = [...activeModels, ...availableModels];
    const parts: (string | { text: string; color: string })[] = [];
    let remaining = message.content;

    const mentionRegex = /@(\w+)/g;
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(message.content)) !== null) {
      // Add text before the mention
      if (match.index > lastIndex) {
        parts.push(message.content.slice(lastIndex, match.index));
      }

      // Check if this mention corresponds to a model
      const mentionedModel = allModels.find(
        (m) => m.shortName.toLowerCase() === match[1].toLowerCase()
      );

      if (mentionedModel) {
        parts.push({ text: match[0], color: mentionedModel.color });
      } else if (match[1].toLowerCase() === "user") {
        parts.push({ text: match[0], color: "#dc2626" });
      } else {
        parts.push(match[0]);
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < message.content.length) {
      parts.push(message.content.slice(lastIndex));
    }

    return parts;
  }, [message.content, activeModels, availableModels]);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[75%] rounded-lg px-4 py-2.5 ${
          isUser
            ? "bg-primary text-white"
            : "bg-surface border-l-4"
        }`}
        style={!isUser ? { borderLeftColor: model?.color || "#666" } : {}}
      >
        {!isUser && (
          <div
            className="text-xs font-semibold mb-1"
            style={{ color: model?.color || "#666" }}
          >
            {message.modelName}
          </div>
        )}
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {formattedContent.map((part, i) =>
            typeof part === "string" ? (
              <span key={i}>{part}</span>
            ) : (
              <span key={i} style={{ color: part.color }} className="font-semibold">
                {part.text}
              </span>
            )
          )}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 bg-foreground/70 animate-blink ml-0.5" />
          )}
        </div>
      </div>
    </div>
  );
}
