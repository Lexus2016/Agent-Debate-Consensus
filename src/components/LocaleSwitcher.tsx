"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { LOCALES, LOCALE_LABEL, detectLocale, type Locale } from "@/lib/i18n";

interface Props {
  variant?: "masthead" | "inline";
  className?: string;
}

export function LocaleSwitcher({ variant = "inline", className = "" }: Props) {
  const locale = useChatStore((s) => s.locale);
  const setLocale = useChatStore((s) => s.setLocale);

  // First-paint detect: if user hasn't picked yet, infer from browser.
  useEffect(() => {
    if (locale === null) {
      setLocale(detectLocale());
    }
  }, [locale, setLocale]);

  const active: Locale = locale ?? "en";

  if (variant === "masthead") {
    return (
      <div
        className={`flex items-center gap-0 font-mono text-[10px] tracking-[0.18em] ${className}`}
      >
        {LOCALES.map((code, i) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={`px-2 py-1 transition-colors duration-150 ${
              active === code
                ? "text-primary"
                : "text-foreground/40 hover:text-foreground/80"
            } ${i > 0 ? "border-l border-[var(--color-rule)]" : ""}`}
            aria-pressed={active === code}
            aria-label={`Switch to ${LOCALE_LABEL[code]}`}
          >
            {LOCALE_LABEL[code]}
          </button>
        ))}
      </div>
    );
  }

  // inline (compact, for chat header)
  return (
    <div
      className={`flex items-center font-mono text-[10px] tracking-[0.15em] rounded-sm border border-[var(--color-rule)] overflow-hidden ${className}`}
      role="group"
      aria-label="Interface language"
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`px-1.5 py-1 leading-none transition-colors duration-150 ${
            active === code
              ? "bg-primary text-background"
              : "text-foreground/55 hover:text-foreground hover:bg-elevated"
          }`}
          aria-pressed={active === code}
        >
          {LOCALE_LABEL[code]}
        </button>
      ))}
    </div>
  );
}
