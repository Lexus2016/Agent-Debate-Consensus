"use client";

import { useState, useEffect, useMemo } from "react";
import { useChatStore } from "@/store/chatStore";
import { Model } from "@/types/chat";

interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
    request: string;
    image: string;
  };
}

interface ModelDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModelDiscoveryModal({ isOpen, onClose }: ModelDiscoveryModalProps) {
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const addAvailableModel = useChatStore((state) => state.addAvailableModel);
  const availableModels = useChatStore((state) => state.availableModels);

  useEffect(() => {
    if (isOpen) {
      fetchModels();
    }
  }, [isOpen]);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/models");
      const data = await response.json();
      if (data.data) {
        setModels(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch models:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredModels = useMemo(() => {
    return models.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [models, search]);

  const handleAddModel = (orModel: OpenRouterModel) => {
    const provider = orModel.id.split("/")[0];
    const shortName =
      orModel.name.split(" ")[0].split(":")[0].split("/").pop() || "AI";

    const colors = ["#ef4444", "#22c55e", "#f97316", "#3b82f6", "#a855f7", "#06b6d4"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newModel: Model = {
      id: orModel.id,
      name: orModel.name,
      shortName: shortName,
      provider: provider,
      color: randomColor,
      isActive: false,
      pricing: {
        prompt: orModel.pricing.prompt,
        completion: orModel.pricing.completion,
      },
      description: orModel.description,
      context_length: orModel.context_length,
    };

    addAvailableModel(newModel);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-surface border border-border/70 w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden animate-fade-in">
        {/* Modal header */}
        <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Discover Agents</h2>
            <p className="text-xs text-muted mt-0.5">Add AI models to your debate</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface-light transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-border/50">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search agents by name or provider..."
              className="w-full bg-surface-light border border-border/60 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 text-sm placeholder:text-muted transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Model list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted gap-3">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm">Loading agents from OpenRouter...</span>
            </div>
          ) : filteredModels.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-muted text-sm">
              No agents found matching &ldquo;{search}&rdquo;
            </div>
          ) : (
            filteredModels.map((model) => {
              const isAdded = availableModels.some((m) => m.id === model.id);
              const promptPrice = (
                parseFloat(model.pricing.prompt) * 1000000
              ).toFixed(2);
              const completionPrice = (
                parseFloat(model.pricing.completion) * 1000000
              ).toFixed(2);

              return (
                <div
                  key={model.id}
                  className="bg-surface-light/40 border border-border/40 rounded-xl p-3.5 flex items-center justify-between hover:bg-surface-light/70 hover:border-border/70 transition-all duration-200 group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-medium truncate text-foreground/90">
                        {model.name}
                      </h3>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-surface-dark border border-border/50 text-muted uppercase tracking-wide flex-shrink-0">
                        {model.id.split("/")[0]}
                      </span>
                    </div>
                    <p className="text-xs text-muted line-clamp-1 mb-1.5">
                      {model.description || "No description available"}
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-muted/70 font-mono">
                      <span>In: ${promptPrice}/1M</span>
                      <span>Out: ${completionPrice}/1M</span>
                      <span>Ctx: {(model.context_length / 1024).toFixed(0)}k</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddModel(model)}
                    disabled={isAdded}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isAdded
                        ? "bg-surface border border-border/40 text-muted cursor-default"
                        : "bg-primary hover:bg-primary-hover text-white shadow-sm shadow-primary/20"
                    }`}
                  >
                    {isAdded ? "Added" : "Add Agent"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border/50 bg-surface-light/20 text-center">
          <p className="text-[10px] text-muted/60">
            Powered by OpenRouter API &bull; Pricing is per 1M tokens
          </p>
        </div>
      </div>
    </div>
  );
}
