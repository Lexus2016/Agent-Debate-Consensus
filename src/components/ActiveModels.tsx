"use client";

import { useChatStore } from "@/store/chatStore";

export function ActiveModels() {
  const activeModels = useChatStore((state) => state.activeModels);

  if (activeModels.length === 0) {
    return (
      <p className="text-xs text-muted leading-relaxed">
        No agents selected. Choose from available agents below.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {activeModels.map((model) => (
        <div
          key={model.id}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border/60 text-xs font-medium transition-all duration-200"
          style={{ borderColor: `${model.color}30` }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: model.color,
              boxShadow: `0 0 6px ${model.color}80`,
            }}
          />
          <span className="text-foreground/80">{model.shortName}</span>
        </div>
      ))}
    </div>
  );
}
