"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useChatStore } from "@/store/chatStore";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { TopicBanner } from "./TopicBanner";

interface Props {
  onBoost?: (content: string, modelName: string) => void;
}

export function MessageList({ onBoost }: Props) {
  const messages = useChatStore((state) => state.messages);
  const typingModels = useChatStore((state) => state.typingModels);
  const activeModels = useChatStore((state) => state.activeModels);
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

  // Auto-scroll only when user is at bottom
  useEffect(() => {
    if (isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingModels, isAtBottom]);

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-5 py-5 relative">
      {messages.length === 0 ? (
        activeModels.length === 0 ? (
          /* No agents active — primary onboarding state */
          <div className="h-full flex items-center justify-center animate-fade-in">
            <div className="text-center max-w-[260px]">
              {/* Arrow pointing left toward sidebar */}
              <div className="flex items-center justify-center mb-6 gap-3">
                <div className="relative flex items-center">
                  {/* Animated arrow */}
                  <svg
                    className="w-5 h-5 text-primary/60"
                    style={{ animation: "nudge-left 1.8s ease-in-out infinite" }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                </div>
                {/* Stacked agent dots — pulsing */}
                <div className="flex items-center gap-1">
                  {["#bf5af2", "#0a84ff", "#30d158", "#ff9f0a"].map((color, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full opacity-30"
                      style={{
                        backgroundColor: color,
                        animation: `pulse-dot 2s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <h2 className="text-[15px] font-semibold text-foreground/80 mb-2 tracking-[-0.01em]">
                Activate agents to begin
              </h2>
              <p className="text-[13px] text-muted leading-relaxed">
                Click any agent in the sidebar to add it to the debate. You need at least one.
              </p>
            </div>
          </div>
        ) : (
          /* Agents ready, no messages yet */
          <div className="h-full flex items-center justify-center animate-fade-in">
            <div className="text-center max-w-[300px]">
              <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <h2 className="text-[16px] font-semibold text-foreground/80 mb-1.5 tracking-[-0.01em]">Start a Debate</h2>
              <p className="text-[14px] text-muted leading-relaxed">
                Pose a question or topic below to begin.
              </p>
            </div>
          </div>
        )
      ) : (
        <>
          <TopicBanner />
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} onBoost={onBoost} />
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
          className="sticky bottom-4 left-1/2 -translate-x-1/2 float-right mr-4 w-9 h-9 flex items-center justify-center rounded-full bg-surface border border-separator shadow-lg shadow-black/20 text-muted hover:text-foreground hover:bg-surface-light transition-all duration-150 animate-fade-in"
          title="Scroll to bottom"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}
    </div>
  );
}
