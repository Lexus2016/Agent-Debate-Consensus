"use client";

import { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { useT } from "@/lib/i18n";
import { ModelDiscoveryModal } from "./ModelDiscoveryModal";
import { ApiKeyPromptModal } from "./ApiKeyPromptModal";
import { Tooltip } from "./Tooltip";
import { availableModels as defaultModels } from "@/lib/models";

export function ModelSelector() {
  const t = useT();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyPromptOpen, setKeyPromptOpen] = useState(false);
  const [keyPromptModel, setKeyPromptModel] = useState<string | undefined>();

  const availableModels = useChatStore((state) => state.availableModels);
  const activeModels = useChatStore((state) => state.activeModels);
  const toggleModel = useChatStore((state) => state.toggleModel);
  const removeModel = useChatStore((state) => state.removeModel);
  const moderatorId = useChatStore((state) => state.moderatorId);
  const setModerator = useChatStore((state) => state.setModerator);
  const failedModels = useChatStore((state) => state.failedModels);
  const clearModelFailed = useChatStore((state) => state.clearModelFailed);
  const maxActiveModels = useChatStore((state) => state.maxActiveModels);
  const appMode = useChatStore((state) => state.appMode);
  const hasServerKey = useChatStore((state) => state.hasServerKey);
  const apiKey = useChatStore((state) => state.apiKey);
  const freeModelIds = useChatStore((state) => state.freeModelIds);

  const isPublicMode = appMode === "public" && hasServerKey;
  const userHasKey = !!apiKey;

  const isAtLimit = activeModels.length >= maxActiveModels;

  const activeIds = new Set(activeModels.map((m) => m.id));
  const sortedModels = [...availableModels].sort((a, b) => {
    const aActive = activeIds.has(a.id) ? 0 : 1;
    const bActive = activeIds.has(b.id) ? 0 : 1;
    return aActive - bActive;
  });

  const isModelFree = (modelId: string) => {
    // If we have the free model list, use it as source of truth
    if (freeModelIds.length > 0) {
      return freeModelIds.includes(modelId);
    }
    // Fallback to pricing field if available
    const model = availableModels.find((m) => m.id === modelId);
    if (model?.pricing) {
      return (
        parseFloat(model.pricing.prompt) === 0 &&
        parseFloat(model.pricing.completion) === 0
      );
    }
    return false;
  };

  return (
    <div>
      <div className="flex items-center justify-between px-2 mb-2 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-[13px] font-semibold text-foreground/85 uppercase tracking-[0.05em]">
            {t.sidebar.agents}
          </h3>
          <span className={`text-[12px] font-medium ${isAtLimit ? "text-amber-400" : "text-muted"}`}>
            {activeModels.length}/{maxActiveModels}
          </span>
        </div>
        <Tooltip text={t.tooltip.browseCatalog} align="end" position="bottom">
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label={t.sidebar.browseTitle}
            className="flex items-center gap-1 px-2.5 h-7 rounded-md text-[13px] font-medium text-foreground/70 hover:text-foreground hover:bg-elevated transition-colors duration-150 leading-none flex-shrink-0"
          >
            <span className="text-[15px] leading-none">+</span>
            <span>{t.sidebar.browseModels}</span>
          </button>
        </Tooltip>
      </div>

      {activeModels.length === 0 && (
        <p className="px-2 mb-3 text-[14px] text-primary font-medium leading-snug">
          {t.sidebar.clickToActivate}
        </p>
      )}

      <div className="space-y-px">
        {sortedModels.map((model, index) => {
          const isActive = activeIds.has(model.id);
          const nextModel = sortedModels[index + 1];
          const showSeparator = isActive && nextModel && !activeIds.has(nextModel.id);
          const isDefault = defaultModels.some((m) => m.id === model.id);
          const isModerator = model.id === moderatorId;
          const isFailed = !!failedModels[model.id];
          const failReason = failedModels[model.id];
          const isDisabledByLimit = !isActive && isAtLimit;
          const isFree = isModelFree(model.id);
          const isPaidBlocked = isPublicMode && !userHasKey && !isFree;

          return (
            <div key={model.id} className="group relative">
              <button
                onClick={() => {
                  if (isDisabledByLimit) return;
                  // In public mode without user key, block paid models
                  if (isPaidBlocked && !isActive) {
                    setKeyPromptModel(model.name);
                    setKeyPromptOpen(true);
                    return;
                  }
                  if (isFailed) {
                    clearModelFailed(model.id);
                  }
                  toggleModel(model.id);
                }}
                className={`w-full flex items-center gap-2.5 py-2 pr-2 rounded-lg text-left transition-all duration-150 ${
                  isActive ? "pl-7" : "pl-2"
                } ${
                  isActive
                    ? isFailed ? "bg-red-500/10" : "bg-elevated"
                    : isDisabledByLimit || isPaidBlocked ? "opacity-40 cursor-not-allowed" : "hover:bg-elevated"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-150 ${
                    isActive ? "opacity-100" : "opacity-40"
                  }`}
                  style={{ backgroundColor: isFailed ? "#ef4444" : model.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className={`text-[15px] font-normal truncate leading-tight flex items-center gap-1.5 ${
                    isFailed ? "text-red-400/80" : "text-foreground/90"
                  }`}>
                    <span className="truncate">{model.name}</span>
                    {isModerator && (
                      <span className="text-[10px] px-1.5 py-[1px] rounded bg-amber-500/15 text-amber-400 font-semibold uppercase tracking-wide flex-shrink-0">
                        mod
                      </span>
                    )}
                    {isPublicMode && !userHasKey && (
                      isFree ? (
                        <span className="text-[10px] px-1.5 py-[1px] rounded bg-green-500/15 text-green-400 font-semibold uppercase tracking-wide flex-shrink-0">
                          free
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-[1px] rounded bg-amber-500/15 text-amber-400 font-semibold uppercase tracking-wide flex-shrink-0">
                          paid
                        </span>
                      )
                    )}
                    {/* Show free badge in non-public mode based on pricing */}
                    {(!isPublicMode || userHasKey) && model.pricing && parseFloat(model.pricing.prompt) === 0 && parseFloat(model.pricing.completion) === 0 && (
                      <span className="text-[9px] px-1 py-[0.5px] rounded bg-green-500/15 text-green-400 font-semibold uppercase tracking-wide flex-shrink-0">
                        free
                      </span>
                    )}
                  </div>
                </div>
                {isFailed && (
                  <div className="relative flex-shrink-0 group/fail">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {/* Tooltip */}
                    <div className="absolute right-0 bottom-full mb-1.5 w-48 px-2.5 py-1.5 rounded-lg bg-background border border-separator text-[11px] text-muted leading-snug opacity-0 pointer-events-none group-hover/fail:opacity-100 transition-opacity duration-150 z-20 shadow-lg">
                      <span className="text-red-400 font-medium">Unavailable</span>
                      {failReason && (
                        <p className="mt-0.5 text-muted/80 break-words">{failReason}</p>
                      )}
                    </div>
                  </div>
                )}
                {isPaidBlocked && !isActive && (
                  <Tooltip text={t.tooltip.paidModel} align="end">
                    <span
                      role="img"
                      aria-label={t.tooltip.paidModel}
                      className="inline-flex"
                    >
                      <svg className="w-3.5 h-3.5 text-muted/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  </Tooltip>
                )}
              </button>

              {/* Moderator toggle — star on the LEFT, always visible for active models.
                  Positioning lives on the outer wrapper so Tooltip's own `relative` stays intact. */}
              {isActive && !isFailed && (
                <div className="absolute left-1 top-1/2 -translate-y-1/2">
                  <Tooltip
                    text={isModerator ? t.tooltip.moderatorUnset : t.tooltip.moderatorSet}
                    align="start"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setModerator(isModerator ? null : model.id);
                      }}
                      aria-label={isModerator ? t.tooltip.moderatorUnset : t.tooltip.moderatorSet}
                      aria-pressed={isModerator}
                      className={`w-5 h-5 flex items-center justify-center rounded-md text-[10px] transition-all duration-150 ${
                        isModerator
                          ? "text-amber-400"
                          : "text-muted/30 hover:text-amber-400"
                      }`}
                    >
                      &#9733;
                    </button>
                  </Tooltip>
                </div>
              )}

              {/* Retry button for failed models */}
              {isFailed && (
                <div className="absolute right-7 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 touch-visible transition-opacity duration-150">
                  <Tooltip text={t.tooltip.retryModel} align="end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearModelFailed(model.id);
                      }}
                      aria-label={t.tooltip.retryModel}
                      className="w-5 h-5 flex items-center justify-center rounded-md text-[11px] text-muted hover:text-foreground transition-colors duration-150"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </Tooltip>
                </div>
              )}

              {!isDefault && (
                <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 touch-visible transition-opacity duration-150">
                  <Tooltip text={t.tooltip.removeModel} align="end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeModel(model.id);
                      }}
                      aria-label={t.tooltip.removeModel}
                      className="w-5 h-5 flex items-center justify-center rounded-md text-[11px] text-muted hover:text-foreground hover:bg-elevated transition-colors duration-150"
                    >
                      ✕
                    </button>
                  </Tooltip>
                </div>
              )}
              {showSeparator && (
                <div className="h-px bg-separator mx-2 my-1.5" />
              )}
            </div>
          );
        })}
      </div>

      {isAtLimit && (
        <div className="mt-2 px-2 text-[11px] text-amber-400/80 leading-snug">
          Limit reached — deactivate an agent to add another
        </div>
      )}

      <ModelDiscoveryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ApiKeyPromptModal
        isOpen={keyPromptOpen}
        onClose={() => setKeyPromptOpen(false)}
        reason="paid-model"
        modelName={keyPromptModel}
      />
    </div>
  );
}
