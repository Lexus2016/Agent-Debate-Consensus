"use client";

import { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { ModelDiscoveryModal } from "./ModelDiscoveryModal";
import { availableModels as defaultModels } from "@/lib/models";

export function ModelSelector() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const availableModels = useChatStore((state) => state.availableModels);
  const activeModels = useChatStore((state) => state.activeModels);
  const toggleModel = useChatStore((state) => state.toggleModel);
  const removeModel = useChatStore((state) => state.removeModel);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-semibold text-muted uppercase tracking-widest">
          Available Agents
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-6 h-6 flex items-center justify-center rounded-lg bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 hover:border-primary/50 transition-all duration-200 text-base leading-none font-bold"
          title="Discover more agents"
        >
          +
        </button>
      </div>

      <div className="space-y-1.5">
        {availableModels.map((model) => {
          const isActive = activeModels.some((m) => m.id === model.id);
          const isDefault = defaultModels.some((m) => m.id === model.id);

          return (
            <div key={model.id} className="group relative">
              <button
                onClick={() => toggleModel(model.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? "bg-surface-light border border-primary/20 shadow-sm shadow-primary/5"
                    : "hover:bg-surface-light/40 border border-transparent"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-200 ${
                    isActive ? "ring-2 ring-offset-2 ring-offset-surface-dark opacity-100" : "opacity-70"
                  }`}
                  style={{
                    backgroundColor: model.color,
                    ...(isActive ? { boxShadow: `0 0 8px ${model.color}60` } : {}),
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate text-foreground/90">{model.name}</div>
                  <div className="text-[10px] text-muted truncate">@{model.shortName}</div>
                </div>
                {isActive && (
                  <div
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide"
                    style={{
                      color: model.color,
                      backgroundColor: `${model.color}18`,
                    }}
                  >
                    Active
                  </div>
                )}
              </button>

              {!isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeModel(model.id);
                  }}
                  className="absolute -right-1 -top-1 w-5 h-5 bg-surface-dark border border-border rounded-full flex items-center justify-center text-[10px] text-muted hover:text-foreground hover:border-muted opacity-0 group-hover:opacity-100 transition-all duration-150 z-10"
                  title="Remove from list"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>

      <ModelDiscoveryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
