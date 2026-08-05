"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useChatStore } from "@/store/chatStore";
import { useT } from "@/lib/i18n";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { TopicBanner } from "./TopicBanner";

interface Props {
  onBoost?: (content: string, modelName: string) => void;
}

export function MessageList({ onBoost }: Props) {
  const t = useT();
  const STARTER_PROMPTS = t.starterPrompts;
  const messages = useChatStore((state) => state.messages);
  const typingModels = useChatStore((state) => state.typingModels);
  const activeModels = useChatStore((state) => state.activeModels);
  // Shared props lifted here so MessageBubble (React.memo) can skip re-renders
  // during streaming — these rarely change compared to message updates.
  const availableModels = useChatStore((state) => state.availableModels);
  const fontSize = useChatStore((state) => state.fontSize);
  const moderatorId = useChatStore((state) => state.moderatorId);
  const setPendingDraft = useChatStore((state) => state.setPendingDraft);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const checkIfAtBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    // Consider "at bottom" if within 80px of the end
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }, []);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Track scroll position
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      setIsAtBottom(checkIfAtBottom());
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [checkIfAtBottom]);

  // Auto-scroll only when user is at bottom. Skip it while the debate is empty:
  // the setup screen is taller than a short viewport, and scrolling to the end
  // would open it on its last block instead of the headline.
  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingModels, isAtBottom]);

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-3 py-3 md:px-5 md:py-5 relative">
      {activeModels.length === 0 ? (
        /* No agents active — primary onboarding state (overrides messages so users always see setup hints when panel is empty) */
          <div className="min-h-full flex items-start md:items-center justify-center py-10 md:py-14 animate-fade-in">
            <div className="max-w-[680px] w-full px-2 md:px-4">
              <div className="flex items-baseline gap-4 mb-8">
                <div className="eyebrow">{t.empty.setup}</div>
                <div className="flex-1 rule" />
              </div>

              <h2 className="font-display text-[48px] sm:text-[64px] md:text-[80px] leading-[0.94] tracking-[-0.025em] mb-6 text-balance">
                {t.empty.stateAH1}
                <br />
                <em
                  className="not-italic text-primary"
                  style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}
                >
                  {t.empty.stateAH2}
                </em>
              </h2>

              <p className="text-[17px] md:text-[19px] text-foreground/70 leading-relaxed mb-9 max-w-[540px] text-pretty">
                <span className="hidden md:inline">{t.empty.stateABody}</span>
                <span className="md:hidden">{t.empty.stateABodyMobile}</span>
              </p>

              <div className="max-w-[540px]">
                {[
                  [t.empty.step1h, t.empty.step1b],
                  [t.empty.step2h, t.empty.step2b],
                  [t.empty.step3h, t.empty.step3b],
                ].map(([h, b], i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-5 py-4 border-t border-[var(--color-rule)]"
                  >
                    <span className="font-mono text-[11px] text-primary tracking-[0.2em] flex-shrink-0 w-7">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="font-display text-[20px] md:text-[22px] text-foreground leading-tight">
                        {h}
                      </div>
                      <div className="text-[14px] text-foreground/55 mt-1 leading-relaxed">
                        {b}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="border-t border-[var(--color-rule)]" />
              </div>

              <div className="hidden md:flex items-center gap-3 mt-10 text-foreground/45">
                <svg
                  className="w-6 h-6 text-primary"
                  style={{ animation: "nudge-left 1.8s ease-in-out infinite" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em]">
                  {t.empty.panelListNudge}
                </span>
              </div>
            </div>
          </div>
      ) : messages.length === 0 ? (
        /* Agents ready, no messages yet */
          <div className="min-h-full flex items-start justify-center py-8 md:py-10 animate-fade-in">
            <div className="max-w-[780px] w-full px-2 md:px-4">
              {/* Eyebrow */}
              <div className="flex items-baseline gap-4 mb-7">
                <div className="eyebrow">{t.empty.tonightsPanel}</div>
                <div className="flex-1 rule" />
              </div>

              {/* Lineup */}
              <div className="flex items-end gap-5 md:gap-7 mb-10 flex-wrap">
                {activeModels.slice(0, 8).map((m) => {
                  const initial = m.shortName.charAt(0).toUpperCase();
                  const isMod = m.id === moderatorId;
                  return (
                    <div key={m.id} className="flex flex-col items-center gap-2.5">
                      <div
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-display text-[26px] md:text-[30px] font-semibold"
                        style={{
                          backgroundColor: m.color,
                          color: "var(--color-background)",
                          boxShadow: `0 0 0 1px ${m.color}66, 0 10px 28px -12px ${m.color}aa`,
                        }}
                        title={m.name}
                      >
                        {initial}
                      </div>
                      <div className="text-center">
                        <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-foreground/85">
                          {m.shortName}
                        </div>
                        {isMod && (
                          <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-primary mt-0.5">
                            · {t.empty.moderator} ·
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Headline */}
              <h2 className="font-display text-[48px] sm:text-[60px] md:text-[80px] leading-[0.94] tracking-[-0.025em] mb-5 text-balance">
                {t.empty.stateBH1}
                <br />
                <em
                  className="not-italic text-primary"
                  style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}
                >
                  {t.empty.stateBH1Accent}
                </em>
                {t.empty.stateBH1Tail}
              </h2>

              <p className="text-[17px] md:text-[19px] text-foreground/65 leading-relaxed mb-7 max-w-[560px] text-pretty">
                {t.empty.stateBBody}
              </p>

              {/* Moderator hint — high-visibility callout */}
              <div className="mb-8 flex items-start gap-3 px-4 py-3.5 rounded-md bg-amber-400/[0.06] border-l-[3px] border-amber-400/70">
                <span
                  className="text-amber-400 text-[22px] leading-none flex-shrink-0 mt-0.5"
                  aria-hidden
                >
                  ★
                </span>
                <p className="font-display italic text-[16px] md:text-[17px] text-foreground/85 leading-snug">
                  {t.empty.tipModerator}
                </p>
              </div>

              {/* Starter topics — editorial list */}
              <ul className="flex flex-col mb-10 border-t border-[var(--color-rule)]">
                {STARTER_PROMPTS.map((prompt, i) => (
                  <li key={prompt} className="border-b border-[var(--color-rule)]">
                    <button
                      type="button"
                      onClick={() => setPendingDraft(prompt)}
                      className="w-full text-left flex items-baseline gap-5 py-3.5 px-1 transition-colors duration-200 hover:bg-elevated group rounded-sm"
                    >
                      <span className="font-mono text-[11px] text-foreground/40 tracking-[0.15em] flex-shrink-0 w-7 group-hover:text-primary transition-colors">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="font-display italic text-[20px] md:text-[24px] text-foreground/85 group-hover:text-foreground transition-colors leading-tight flex-1"
                        style={{
                          fontVariationSettings: '"SOFT" 100, "WONK" 0, "opsz" 144',
                        }}
                      >
                        {prompt}
                      </span>
                      <span
                        className="font-mono text-[14px] text-foreground/25 group-hover:text-primary group-hover:translate-x-1 transition-[color,translate] flex-shrink-0"
                        aria-hidden
                      >
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* @mention hint — quieter, below the chips */}
              <div className="font-mono text-[13px] text-foreground/55 leading-relaxed border-l-2 border-primary/40 pl-4 italic">
                <span className="not-italic text-foreground/80">{t.empty.tipLabel}</span>{" "}
                {t.empty.tipTypeWord}{" "}
                <code
                  className="not-italic px-1.5 py-0.5 rounded bg-elevated text-foreground text-[13px] font-mono"
                  style={{ letterSpacing: 0 }}
                >
                  @{activeModels[0]?.shortName ?? "Model"}
                </code>{" "}
                {t.empty.tipTail}
              </div>
            </div>
          </div>
      ) : (
        <>
          <TopicBanner />
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              activeModels={activeModels}
              availableModels={availableModels}
              fontSize={fontSize}
              moderatorId={moderatorId}
              onBoost={onBoost}
            />
          ))}
        </>
      )}
      <TypingIndicator />
      <div ref={bottomRef} />

      {/* Scroll to bottom button */}
      {!isAtBottom && messages.length > 0 && (
        <button
          onClick={() => {
            scrollToBottom();
            setIsAtBottom(true);
          }}
          aria-label={t.tooltip.scrollToBottom}
          className="tap-target sticky bottom-4 left-1/2 -translate-x-1/2 float-right mr-4 w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-separator shadow-lg shadow-black/20 text-muted hover:text-foreground hover:bg-surface-light transition-colors duration-150 animate-fade-in"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  );
}
