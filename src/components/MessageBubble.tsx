"use client";

import { Message } from "@/types/chat";
import { useChatStore } from "@/store/chatStore";
import { messageToMarkdown } from "@/lib/exportChat";
import { useMemo, useState } from "react";

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const activeModels = useChatStore((state) => state.activeModels);
  const availableModels = useChatStore((state) => state.availableModels);
  const [reasoningExpanded, setReasoningExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  const model = [...activeModels, ...availableModels].find(
    (m) => m.id === message.modelId
  );

  // Parse and highlight @mentions
  const formattedContent = useMemo(() => {
    const allModels = [...activeModels, ...availableModels];
    const parts: (string | { text: string; color: string })[] = [];

    const mentionRegex = /@(\w+)/g;
    let lastIndex = 0;
    let execResult: RegExpExecArray | null;

    while ((execResult = mentionRegex.exec(message.content)) !== null) {
      const match = execResult;
      if (match.index > lastIndex) {
        parts.push(message.content.slice(lastIndex, match.index));
      }

      const mentionedModel = allModels.find(
        (m) => m.shortName.toLowerCase() === match[1].toLowerCase()
      );

      if (mentionedModel) {
        parts.push({ text: match[0], color: mentionedModel.color });
      } else if (match[1].toLowerCase() === "user") {
        parts.push({ text: match[0], color: "#6366f1" });
      } else {
        parts.push(match[0]);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < message.content.length) {
      parts.push(message.content.slice(lastIndex));
    }

    return parts;
  }, [message.content, activeModels, availableModels]);

  const handleCopy = async () => {
    const md = messageToMarkdown(message);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get first letter for avatar
  const avatarLetter = model?.shortName?.[0]?.toUpperCase() ?? "A";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 animate-fade-in group/msg">
        <div className="max-w-[72%]">
          <div className="flex items-center justify-end gap-2 mb-1">
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover/msg:opacity-100 transition-opacity duration-150 p-1 rounded-md hover:bg-white/10"
              title="Copy as Markdown"
            >
              {copied ? (
                <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
            <div className="text-[10px] text-muted font-medium tracking-wide uppercase">
              You
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary to-accent text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-lg shadow-primary/15">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {formattedContent.map((part, i) =>
                typeof part === "string" ? (
                  <span key={i}>{part}</span>
                ) : (
                  <span key={i} style={{ color: "rgba(255,255,255,0.85)" }} className="font-semibold">
                    {part.text}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4 animate-fade-in group/msg">
      <div className="flex gap-3 max-w-[78%]">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5 shadow-md"
          style={{ backgroundColor: model?.color ?? "#3f3f46" }}
        >
          {avatarLetter}
        </div>

        <div className="flex-1 min-w-0">
          {/* Model name + copy button */}
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="text-xs font-semibold leading-none"
              style={{ color: model?.color ?? "#71717a" }}
            >
              {message.modelName ?? "Agent"}
            </div>
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover/msg:opacity-100 transition-opacity duration-150 p-1 rounded-md hover:bg-surface-light"
              title="Copy as Markdown"
            >
              {copied ? (
                <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          {/* Reasoning block */}
          {message.reasoning && (
            <div className="mb-2 rounded-xl border border-border/50 overflow-hidden">
              <button
                onClick={() => setReasoningExpanded(!reasoningExpanded)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-surface-light/60 hover:bg-surface-light/80 transition-colors text-left"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-muted animate-pulse flex-shrink-0" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted flex-1">
                  Thinking...
                </span>
                <svg
                  className={`w-3 h-3 text-muted transition-transform duration-200 ${reasoningExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {reasoningExpanded && (
                <div className="px-3 py-2 bg-surface-dark/40 text-xs text-muted italic leading-relaxed border-t border-border/30">
                  {message.reasoning}
                </div>
              )}
            </div>
          )}

          {/* Message content */}
          <div className="bg-surface border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
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
                <span className="inline-block w-2 h-[1.1em] bg-foreground/60 animate-blink ml-0.5 rounded-sm align-text-bottom" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
