"use client";

import { useChatStore } from "@/store/chatStore";

export function ActiveModels() {
  const activeModels = useChatStore((state) => state.activeModels);

  if (activeModels.length === 0) {
    return (
      <div className="text-muted text-sm">
        No models active. Select models from below to start.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeModels.map((model) => (
        <div
          key={model.id}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-sm"
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: model.color }}
          />
          <span>{model.shortName}</span>
        </div>
      ))}
    </div>
  );
}
