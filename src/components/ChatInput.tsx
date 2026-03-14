"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  onSend: (message: string) => void;
  onStop: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
}

export function ChatInput({ onSend, onStop, disabled, isGenerating }: Props) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border/50 p-4 bg-background">
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? "Select agents from the sidebar to begin..."
                : "Join the debate... (use @Model to address specific agent)"
            }
            disabled={disabled}
            rows={1}
            className="w-full bg-surface-light border border-border/60 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 disabled:opacity-40 disabled:cursor-not-allowed placeholder:text-muted transition-all duration-200 leading-relaxed"
          />
        </div>

        {/* Stop button — shown only during generation, alongside the Send button */}
        {isGenerating && (
          <button
            onClick={onStop}
            title="Stop generation"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-border/60 rounded-xl text-muted hover:text-foreground hover:border-border hover:bg-surface-light transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="5" y="5" width="14" height="14" rx="2" />
            </svg>
          </button>
        )}

        {/* Send button — always visible */}
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          title="Send message"
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary to-accent rounded-xl text-white font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:scale-105 shadow-lg shadow-primary/20 disabled:shadow-none disabled:scale-100"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>

      {isGenerating && (
        <div className="flex items-center gap-1.5 mt-2 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-[11px] text-muted">
            Agents are debating — you can intervene at any time
          </p>
        </div>
      )}
    </div>
  );
}
