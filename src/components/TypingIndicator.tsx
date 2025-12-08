"use client";

import { useChatStore } from "@/store/chatStore";

export function TypingIndicator() {
  const typingModels = useChatStore((state) => state.typingModels);
  const activeModels = useChatStore((state) => state.activeModels);

  if (typingModels.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      {typingModels.map((typing) => {
        const model = activeModels.find((m) => m.id === typing.modelId);
        return (
          <div
            key={typing.modelId}
            className="flex items-center gap-2 text-muted text-sm"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: model?.color || "#666" }}
            />
            <span>{typing.modelName} is thinking</span>
            <span className="flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce-dot" />
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce-dot-delay-1" />
              <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce-dot-delay-2" />
            </span>
          </div>
        );
      })}
    </div>
  );
}
