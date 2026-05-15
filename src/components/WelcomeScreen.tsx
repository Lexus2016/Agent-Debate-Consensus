"use client";

import { useState, useLayoutEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { useT } from "@/lib/i18n";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Tooltip } from "./Tooltip";

export function WelcomeScreen() {
  const t = useT();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [validating, setValidating] = useState(false);
  const setApiKey = useChatStore((state) => state.setApiKey);
  const hasServerKey = useChatStore((state) => state.hasServerKey);
  const apiKey = useChatStore((state) => state.apiKey);
  const setShowLanding = useChatStore((state) => state.setShowLanding);
  // Visitor can dismiss the landing only if they actually have a way back
  // (server key already configured or their own user key stored).
  const canReturn = hasServerKey || !!apiKey;

  // The landing now uses its own internal scroll container (h-dvh + overflow-y-auto
  // on the root), so initial scrollTop is 0 by mount. No body-level scroll-restoration
  // pitfalls. We still reset on mount to be safe across remounts.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.getElementById("welcome-root");
    if (root) root.scrollTop = 0;
  }, []);

  const handleSubmit = async () => {
    const trimmed = key.trim();
    if (!trimmed) return;

    setValidating(true);
    setError("");

    try {
      const res = await fetch("/api/models", {
        headers: { "x-api-key": trimmed },
      });

      if (!res.ok) {
        setError(t.welcome.errorBadKey);
        setValidating(false);
        return;
      }

      setApiKey(trimmed);
    } catch {
      setError(t.welcome.errorNet);
      setValidating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const steps = [
    { n: "01", h: t.welcome.step01h, b: t.welcome.step01b },
    { n: "02", h: t.welcome.step02h, b: t.welcome.step02b },
    { n: "03", h: t.welcome.step03h, b: t.welcome.step03b },
  ];

  return (
    <div id="welcome-root" className="h-dvh flex flex-col px-5 py-6 md:px-12 md:py-10 lg:px-20 lg:py-14 overflow-y-auto overflow-x-hidden">
      {/* Masthead */}
      <header
        className="flex items-center justify-between gap-4 mb-8 md:mb-10 stagger-up flex-wrap"
        style={{ animationDelay: "0ms" }}
      >
        <div className="eyebrow text-foreground/70">
          <span className="text-primary">●</span>&nbsp;&nbsp;{t.welcome.masthead}
        </div>
        <div className="flex items-center gap-5">
          <div className="eyebrow hidden md:block">{t.welcome.mastheadAside}</div>
          <LocaleSwitcher variant="masthead" />
          {canReturn && (
            <Tooltip text={t.tooltip.backToDebate} align="end" position="bottom">
              <button
                type="button"
                onClick={() => setShowLanding(false)}
                aria-label={t.tooltip.backToDebate}
                className="w-8 h-8 flex items-center justify-center rounded-md text-foreground/55 hover:text-foreground hover:bg-elevated transition-colors duration-150"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Tooltip>
          )}
        </div>
      </header>

      <div
        className="rule-thick mb-8 md:mb-12 stagger-up"
        style={{ animationDelay: "60ms" }}
      />

      {/* Hero */}
      <section className="grid md:grid-cols-12 gap-6 md:gap-10 mb-14 md:mb-24">
        <div
          className="md:col-span-7 stagger-up"
          style={{ animationDelay: "120ms" }}
        >
          <h1 className="font-display text-[56px] sm:text-[72px] md:text-[96px] lg:text-[120px] leading-[0.9] font-light tracking-[-0.03em]">
            {t.welcome.heroTop}
            <br />
            {t.welcome.heroMid}
            <br />
            <em
              className="not-italic text-primary font-normal"
              style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}
            >
              {t.welcome.heroBottom}
            </em>
          </h1>
        </div>

        <div
          className="md:col-span-5 md:pt-6 flex flex-col stagger-up"
          style={{ animationDelay: "240ms" }}
        >
          <p className="pullquote text-[22px] md:text-[26px] text-foreground mb-6">
            {t.welcome.heroPullquote}
          </p>
          <div className="rule mb-6" />
          <p className="text-[16px] leading-relaxed text-foreground/75">
            {t.welcome.heroBody}
            <span className="font-display italic text-foreground">
              {t.welcome.heroBodyTail}
            </span>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        className="mb-14 md:mb-20 stagger-up"
        style={{ animationDelay: "340ms" }}
      >
        <div className="flex items-baseline gap-4 mb-8">
          <div className="eyebrow">{t.welcome.howItWorks}</div>
          <div className="flex-1 rule" />
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map(({ n, h, b }) => (
            <div key={n} className="flex flex-col">
              <div className="font-mono text-[12px] text-primary mb-3 tracking-[0.2em]">
                {n}
              </div>
              <h3 className="font-display text-[26px] md:text-[30px] leading-[1.05] mb-3 tracking-[-0.015em]">
                {h}
              </h3>
              <p className="text-[15px] leading-relaxed text-foreground/70">{b}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="rule-thick mb-10 md:mb-14" />

      {/* Step One — Connect key */}
      <section
        className="grid md:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-16 stagger-up"
        style={{ animationDelay: "440ms" }}
      >
        <div className="md:col-span-5">
          <div className="eyebrow mb-4">{t.welcome.stepOne}</div>
          <h2 className="font-display text-[42px] md:text-[56px] lg:text-[64px] leading-[0.95] tracking-[-0.02em] mb-5">
            {t.welcome.connectKey1}
            <br />
            <em
              className="not-italic text-primary"
              style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1, "opsz" 144' }}
            >
              {t.welcome.connectKey2}
            </em>
          </h2>
          <p className="text-[16px] leading-relaxed text-foreground/75 mb-5">
            <span className="font-display italic text-foreground">
              {t.welcome.openRouterName}
            </span>{" "}
            {t.welcome.openRouterBlurb}
          </p>
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-baseline gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-primary hover:underline underline-offset-4 decoration-1"
          >
            {t.welcome.getKey}
            <span aria-hidden>→</span>
          </a>
        </div>

        <div className="md:col-span-7 flex flex-col">
          <label htmlFor="api-key-input" className="eyebrow mb-4 block">
            {t.welcome.yourApiKey}
          </label>
          <input
            id="api-key-input"
            type="password"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.welcome.keyPlaceholder}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent border-0 border-b border-[var(--color-rule)] focus:border-primary px-0 py-3 text-[22px] md:text-[28px] font-mono outline-none placeholder:text-muted/40 transition-colors duration-200 text-foreground caret-primary"
          />
          {error && (
            <p className="font-mono text-[13px] text-primary mt-3 flex items-baseline gap-2">
              <span aria-hidden>✕</span>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!key.trim() || validating}
            className="self-start mt-7 group inline-flex items-baseline gap-3 bg-primary px-7 py-4 text-background font-mono text-[13px] uppercase tracking-[0.2em] hover:bg-primary-hover active:scale-[0.99] transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed"
          >
            {validating ? (
              <>
                {t.welcome.connecting}
                <span className="animate-blink">_</span>
              </>
            ) : (
              <>
                {t.welcome.openTheFloor}
                <span
                  className="font-display text-[16px] tracking-normal not-italic"
                  aria-hidden
                >
                  →
                </span>
              </>
            )}
          </button>

          <div className="mt-7 max-w-[480px] flex items-start gap-3">
            <span
              className="font-mono text-[10px] text-foreground/40 mt-1 flex-shrink-0 leading-none"
              aria-hidden
            >
              ※
            </span>
            <p className="text-[13.5px] text-foreground/55 leading-relaxed italic">
              {t.welcome.privacy}
            </p>
          </div>
        </div>
      </section>

      <div className="flex-1" />

      {/* Colophon */}
      <footer className="flex flex-wrap items-center justify-between gap-4 pt-8 mt-4 border-t border-[var(--color-rule)] font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/50">
        <div>
          <span className="text-foreground/80">{t.welcome.footerName}</span>
          &nbsp;·&nbsp; {t.welcome.footerOpen}
        </div>
        <a
          href="https://github.com/Lexus2016/Agent-Debate-Consensus"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors flex items-baseline gap-1.5"
        >
          GitHub
          <span aria-hidden className="text-[10px]">↗</span>
        </a>
      </footer>
    </div>
  );
}
