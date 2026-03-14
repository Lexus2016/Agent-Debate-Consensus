"use client";

import { useChatStore } from "@/store/chatStore";

export function TypingIndicator() {
  const typingModels = useChatStore((state) => state.typingModels);
  const activeModels = useChatStore((state) => state.activeModels);

  if (typingModels.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-2 animate-fade-in">
      {typingModels.map((typing) => {
        const model = activeModels.find((m) => m.id === typing.modelId);
        return (
          <div
            key={typing.modelId}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-surface border border-border/50 w-fit max-w-[200px]"
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                backgroundColor: model?.color ?? "#71717a",
                boxShadow: `0 0 6px ${model?.color ?? "#71717a"}60`,
              }}
            />
            <span className="text-xs text-muted font-medium truncate">
              {typing.modelName}
            </span>
            <span className="flex items-center gap-0.5 flex-shrink-0">
              <span
                className="w-1.5 h-1.5 rounded-full animate-bounce-dot"
                style={{ backgroundColor: model?.color ?? "#71717a" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full animate-bounce-dot-delay-1"
                style={{ backgroundColor: model?.color ?? "#71717a" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full animate-bounce-dot-delay-2"
                style={{ backgroundColor: model?.color ?? "#71717a" }}
              />
            </span>
          </div>
        );
      })}
    </div>
  );
}
