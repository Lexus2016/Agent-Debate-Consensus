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
  const [focused, setFocused] = useState(false);

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
    <div className="px-5 pb-5 pt-2">
      <div
        className={`flex items-end gap-2 bg-surface-light rounded-[14px] border px-3 py-2 transition-all duration-150 ${
          focused
            ? "border-primary/40 ring-1 ring-primary/20"
            : "border-separator"
        } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={
            disabled
              ? "Select agents to begin..."
              : "Message... (use @Model to mention)"
          }
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-[15px] leading-[1.5] resize-none focus:outline-none disabled:cursor-not-allowed placeholder:text-muted py-0.5"
        />

        <div className="flex items-center gap-1.5 flex-shrink-0 pb-0.5">
          {isGenerating && (
            <button
              onClick={onStop}
              title="Stop generation"
              className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-surface-hover text-muted hover:text-foreground transition-colors duration-150"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            title="Send message"
            className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-primary text-white transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-primary-hover active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
      </div>

      {isGenerating && (
        <p className="text-[12px] text-muted mt-2 ml-1">
          Agents debating — you can intervene at any time
        </p>
      )}
    </div>
  );
}
