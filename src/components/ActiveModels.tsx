"use client";

import { useChatStore } from "@/store/chatStore";

export function ActiveModels() {
  const activeModels = useChatStore((state) => state.activeModels);

  if (activeModels.length === 0) {
    return (
      <p className="px-2 text-[12px] text-muted/50 leading-relaxed">
        No agents selected
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5 px-1">
      {activeModels.map((model) => (
        <div
          key={model.id}
          className="flex items-center gap-1.5 pl-2 pr-2.5 py-[3px] rounded-full bg-elevated text-[11px] font-medium text-foreground/70"
        >
          <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: model.color }}
          />
          {model.shortName}
        </div>
      ))}
    </div>
  );
}
