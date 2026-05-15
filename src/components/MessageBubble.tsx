"use client";

import React, { useMemo } from "react";
import { Message, Model } from "@/types/chat";
import { messageToMarkdown } from "@/lib/exportChat";
import { getThinkingStyleLabel } from "@/lib/conversationEngine";
import { useRef, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { useT } from "@/lib/i18n";
import { Tooltip } from "./Tooltip";

/**
 * Sanitization schema based on GitHub's defaults (allows br, table, a, img, etc.).
 * Adds <mark> for highlighted text. Blocks <script>, <iframe>, <style>, <object>,
 * <embed>, <form>, and all event handler attributes.
 */
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "mark"],
};

/**
 * Process React children and replace @mentions with colored spans.
 * Matches @shortName against known models and colors them accordingly.
 */
function highlightMentions(
  children: React.ReactNode,
  models: Model[],
  inUserBubble = false
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child !== "string") return child;

    const mentionRegex = /@(\w[\w.-]*)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(child)) !== null) {
      if (match.index > lastIndex) {
        parts.push(child.slice(lastIndex, match.index));
      }

      const mentionName = match[1];
      const mentionedModel = models.find(
        (m) => m.shortName.toLowerCase() === mentionName.toLowerCase()
      );

      if (mentionedModel) {
        parts.push(
          inUserBubble ? (
            <span
              key={match.index}
              className="inline-flex items-center font-semibold px-1.5 py-0.5 rounded-md text-white text-[0.9em]"
              style={{ backgroundColor: `${mentionedModel.color}80` }}
            >
              @{mentionedModel.shortName}
            </span>
          ) : (
            <span
              key={match.index}
              className="font-semibold"
              style={{ color: mentionedModel.color }}
            >
              @{mentionedModel.shortName}
            </span>
          )
        );
      } else if (mentionName.toLowerCase() === "user") {
        parts.push(
          <span key={match.index} className="font-semibold underline underline-offset-2">
            @User
          </span>
        );
      } else if (mentionName.toLowerCase() === "all") {
        parts.push(
          inUserBubble ? (
            <span
              key={match.index}
              className="inline-flex items-center font-semibold px-1.5 py-0.5 rounded-md text-white text-[0.9em] bg-primary/60"
            >
              @ALL
            </span>
          ) : (
            <span key={match.index} className="font-semibold text-primary">
              @ALL
            </span>
          )
        );
      } else {
        parts.push(match[0]);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < child.length) {
      parts.push(child.slice(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : child;
  });
}

const COLLAPSE_THRESHOLD = 300; // pixels
const FILE_PREVIEW_LINES = 20;

interface Props {
  message: Message;
  /** Passed from MessageList to avoid per-bubble store subscriptions */
  activeModels: Model[];
  availableModels: Model[];
  fontSize: number;
  moderatorId: string | null;
  onBoost?: (content: string, modelName: string) => void;
}

export const MessageBubble = React.memo(function MessageBubble({
  message,
  activeModels,
  availableModels,
  fontSize,
  moderatorId,
  onBoost,
}: Props) {
  const t = useT();
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fileExpanded, setFileExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const isUser = message.role === "user";
  const isSummary = message.messageType === "summary";

  // Stable combined list — recomputed only when activeModels/availableModels change,
  // NOT on every streaming token update.
  const allModels = useMemo(
    () => [...activeModels, ...availableModels],
    [activeModels, availableModels]
  );
  const uniqueModels = useMemo(
    () => allModels.filter((m, i, arr) => arr.findIndex((a) => a.id === m.id) === i),
    [allModels]
  );

  const model = useMemo(
    () => uniqueModels.find((m) => m.id === message.modelId),
    [uniqueModels, message.modelId]
  );

  // Stable reference — only changes when models change, not on every streaming token.
  // ReactMarkdown sees the same components object → avoids internal reconciliation overhead.
  const markdownComponents = useMemo((): Components => ({
    p: ({ children }) => (
      <p className="mb-2 last:mb-0">{highlightMentions(children, uniqueModels)}</p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold">{highlightMentions(children, uniqueModels)}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{highlightMentions(children, uniqueModels)}</em>
    ),
    h1: ({ children }) => (
      <h1 className="text-[1.3em] font-bold mb-2 mt-3 first:mt-0">{highlightMentions(children, uniqueModels)}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-[1.15em] font-bold mb-1.5 mt-2.5 first:mt-0">{highlightMentions(children, uniqueModels)}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-[1.05em] font-semibold mb-1 mt-2 first:mt-0">{highlightMentions(children, uniqueModels)}</h3>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-5 mb-2 space-y-0.5">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 mb-2 space-y-0.5">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="leading-[1.5]">{highlightMentions(children, uniqueModels)}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary/40 pl-3 my-2 text-foreground/70 italic">
        {highlightMentions(children, uniqueModels)}
      </blockquote>
    ),
    code: ({ className, children }) => {
      const isBlock = className?.includes("language-");
      if (isBlock) {
        return (
          <code className="block bg-background rounded-lg px-3 py-2 my-2 text-[0.88em] font-mono overflow-x-auto whitespace-pre">
            {children}
          </code>
        );
      }
      return (
        <code className="bg-elevated px-1.5 py-0.5 rounded text-[0.88em] font-mono">
          {children}
        </code>
      );
    },
    pre: ({ children }) => <pre className="my-1">{children}</pre>,
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline underline-offset-2 hover:text-accent/80"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </a>
    ),
    hr: () => <hr className="border-separator my-3" />,
    table: ({ children }) => (
      <div className="overflow-x-auto my-2">
        <table className="min-w-full text-[0.9em]">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-separator px-2 py-1 font-semibold text-left bg-elevated">
        {highlightMentions(children, uniqueModels)}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-separator px-2 py-1">
        {highlightMentions(children, uniqueModels)}
      </td>
    ),
  }), [uniqueModels]);

  const handleCopy = async () => {
    const md = messageToMarkdown(message);
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const avatarLetter = model?.shortName?.[0]?.toUpperCase() ?? "A";

  // System event — editorial rule with mono eyebrow caption, like a press notice
  if (message.role === "system") {
    return (
      <div className="flex items-center justify-center my-5 animate-fade-in gap-3 px-4">
        <div className="flex-1 h-px bg-[var(--color-rule)] max-w-[160px]" />
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-foreground/55 whitespace-nowrap text-center">
          {message.content}
        </span>
        <div className="flex-1 h-px bg-[var(--color-rule)] max-w-[160px]" />
      </div>
    );
  }

  // Don't render empty messages that finished streaming
  if (!isUser && !message.content && !message.isStreaming) {
    return null;
  }

  // Check if content is long enough to collapse (rough heuristic: >500 chars)
  const isLongMessage = message.content.length > 600 && !message.isStreaming;

  // User messages — plain text
  if (isUser) {
    return (
      <div
        className="flex justify-end mb-5 animate-fade-in group/msg"
        style={{ contentVisibility: "auto", containIntrinsicSize: "auto 80px" }}
      >
        <div className="max-w-[85%] md:max-w-[72%]">
          <div className="flex items-baseline justify-end gap-2.5 mb-2">
            <Tooltip text={t.tooltip.copyAsMarkdown}>
              <button
                onClick={handleCopy}
                aria-label={t.tooltip.copyAsMarkdown}
                className="opacity-0 group-hover/msg:opacity-100 touch-visible p-1 rounded-sm hover:bg-elevated transition-all duration-150"
              >
                {copied ? (
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </Tooltip>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-foreground/65 font-medium">You</span>
          </div>
          <div className="bg-primary text-background rounded-md px-4 py-3 md:px-5 md:py-3.5">
            {message.content && (
              <div className="whitespace-pre-wrap leading-[1.6]" style={{ fontSize: `${fontSize}px` }}>
                {highlightMentions(message.content, uniqueModels, true)}
              </div>
            )}
            {message.attachment && (
              <div className={`${message.content ? "mt-2 pt-2 border-t border-white/20" : ""}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); setFileExpanded(!fileExpanded); }}
                  className="flex items-center gap-2 text-[13px] text-white/80 hover:text-white transition-colors w-full"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="truncate">{message.attachment.fileName}</span>
                  <span className="text-[11px] text-white/50 flex-shrink-0">
                    {(message.attachment.size / 1024).toFixed(1)} KB
                  </span>
                  <svg
                    className={`w-3 h-3 flex-shrink-0 transition-transform duration-150 ${fileExpanded ? "rotate-90" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {fileExpanded && (
                  <pre className="mt-2 p-2 bg-black/20 rounded-lg text-[12px] leading-[1.5] overflow-x-auto max-h-[300px] overflow-y-auto whitespace-pre-wrap break-words">
                    {message.attachment.content.split("\n").length > FILE_PREVIEW_LINES
                      ? message.attachment.content.split("\n").slice(0, FILE_PREVIEW_LINES).join("\n") + `\n\n... (${message.attachment.content.split("\n").length - FILE_PREVIEW_LINES} more lines)`
                      : message.attachment.content}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // AI messages — editorial column with serif avatar, byline rule, and border-left in model color
  const modelColor = model?.color ?? "var(--color-foreground)";

  return (
    <div
      className={`flex justify-start mb-6 animate-fade-in group/msg ${isSummary ? "mb-7" : ""}`}
      style={{ contentVisibility: "auto", containIntrinsicSize: "auto 120px" }}
    >
      <div className={`flex gap-3 md:gap-4 ${isSummary ? "max-w-[96%] md:max-w-[88%]" : "max-w-[94%] md:max-w-[82%]"}`}>
        {/* Avatar — serif initial with halo */}
        <div
          className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-display text-[17px] md:text-[19px] font-semibold flex-shrink-0 mt-1"
          style={{
            backgroundColor: model?.color ?? "var(--color-muted)",
            color: "var(--color-background)",
            boxShadow: isSummary
              ? `0 0 0 2px rgba(212, 156, 92, 0.55), 0 0 0 4px var(--color-background), 0 6px 16px -8px ${model?.color ?? "rgba(0,0,0,0.4)"}aa`
              : `0 0 0 1px ${model?.color ?? "#3a3a3c"}55, 0 6px 16px -8px ${model?.color ?? "rgba(0,0,0,0.3)"}88`,
          }}
        >
          {avatarLetter}
        </div>

        <div className="flex-1 min-w-0">
          {/* Editorial byline */}
          <div className="flex items-baseline gap-2.5 mb-2 flex-wrap">
            <span
              className="font-display text-[15px] md:text-[16px] font-medium leading-none tracking-[-0.01em]"
              style={{ color: modelColor }}
            >
              {message.modelName ?? "Agent"}
            </span>
            {isSummary && (
              <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-amber-400 font-semibold">
                · summary ·
              </span>
            )}
            {!isSummary && message.modelId === moderatorId && (
              <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-amber-400 font-semibold">
                · {t.empty.moderator} ·
              </span>
            )}
            {!isSummary && model?.thinkingStyle && (
              <Tooltip text={t.tooltip.thinkingStyle}>
                <span
                  aria-label={`${t.tooltip.thinkingStyle}: ${getThinkingStyleLabel(model.thinkingStyle)}`}
                  className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-foreground/45 cursor-help"
                >
                  {getThinkingStyleLabel(model.thinkingStyle)}
                </span>
              </Tooltip>
            )}
            <div className="flex-1" />
            <Tooltip text={t.tooltip.copyAsMarkdown} align="end">
              <button
                onClick={handleCopy}
                aria-label={t.tooltip.copyAsMarkdown}
                className="opacity-0 group-hover/msg:opacity-100 touch-visible p-1 rounded-sm hover:bg-elevated transition-all duration-150"
              >
                {copied ? (
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-foreground/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </Tooltip>
            {onBoost && (
              <Tooltip text={t.tooltip.boost} align="end">
                <button
                  onClick={() => onBoost(message.content, message.modelName ?? "Agent")}
                  aria-label={t.tooltip.boost}
                  className="opacity-0 group-hover/msg:opacity-100 touch-visible p-1 rounded-sm hover:bg-elevated transition-all duration-150 text-foreground/45 hover:text-primary"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              </Tooltip>
            )}
          </div>

          {/* Reasoning — italic pull-quote */}
          {message.reasoning && (
            <div className="mb-3">
              <button
                onClick={() => setReasoningOpen(!reasoningOpen)}
                className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-foreground/55 hover:text-foreground transition-colors duration-150"
              >
                <svg
                  className={`w-3 h-3 transition-transform duration-150 ${reasoningOpen ? "rotate-90" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                Thinking aloud
              </button>
              {reasoningOpen && (
                <div className="mt-2 pl-4 border-l-2 border-[var(--color-rule)] font-display italic text-[14px] md:text-[15px] text-foreground/65 leading-relaxed">
                  {message.reasoning}
                </div>
              )}
            </div>
          )}

          {/* Body — editorial column with model-color rule, no boxy bubble */}
          <div
            className={`relative pl-4 md:pl-5 border-l-2 transition-colors ${
              isLongMessage ? "cursor-pointer" : ""
            } ${isSummary ? "py-2 -my-1 bg-amber-400/[0.05] pr-3" : ""}`}
            style={{
              borderLeftColor: isSummary
                ? "rgba(212, 156, 92, 0.6)"
                : `${model?.color ?? "var(--color-rule)"}55`,
            }}
            onClick={() => { if (isLongMessage) setExpanded(!expanded); }}
          >
            <div
              ref={contentRef}
              className={`markdown-body leading-[1.65] text-foreground/90 transition-all duration-200 ${
                isLongMessage && !expanded ? "overflow-hidden" : ""
              }`}
              style={{
                fontSize: `${fontSize}px`,
                maxHeight: isLongMessage && !expanded ? `${COLLAPSE_THRESHOLD}px` : undefined,
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span
                  className="inline-block w-[2px] h-[1.1em] animate-blink ml-0.5 align-text-bottom"
                  style={{ backgroundColor: modelColor }}
                />
              )}
            </div>

            {/* Gradient fade when collapsed */}
            {isLongMessage && !expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-t from-[var(--color-background)] to-transparent" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
