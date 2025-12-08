"use client";

import { useChatStore } from "@/store/chatStore";

export function ModelSelector() {
  const availableModels = useChatStore((state) => state.availableModels);
  const activeModels = useChatStore((state) => state.activeModels);
  const toggleModel = useChatStore((state) => state.toggleModel);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
        Available Models
      </h3>
      {availableModels.map((model) => {
        const isActive = activeModels.some((m) => m.id === model.id);
        return (
          <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
              isActive
                ? "bg-surface-light border border-border"
                : "hover:bg-surface-light/50"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all ${
                isActive ? "ring-2 ring-offset-2 ring-offset-background" : ""
              }`}
              style={{
                backgroundColor: model.color,
                ringColor: model.color,
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{model.name}</div>
              <div className="text-xs text-muted truncate">@{model.shortName}</div>
            </div>
            {isActive && (
              <div className="text-xs text-primary font-medium">Active</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
