"use client";

import { ReactNode, useId, isValidElement, cloneElement, ReactElement } from "react";

interface Props {
  text: string;
  position?: "top" | "bottom";
  align?: "start" | "center" | "end";
  className?: string;
  delay?: number;
  children: ReactNode;
}

/**
 * Editorial tooltip — mono uppercase, inverted-fg surface.
 * - Pure-CSS hover via `group/tip` named scope, zero JS state.
 * - Auto-wires aria-describedby on first child so screen readers
 *   pair the tooltip text with the trigger button.
 */
export function Tooltip({
  text,
  position = "top",
  align = "center",
  className = "",
  delay = 150,
  children,
}: Props) {
  const id = useId();
  const tooltipId = `tip-${id}`;

  const alignClass =
    align === "start"
      ? "left-0"
      : align === "end"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";
  const positionClass = position === "top" ? "bottom-full mb-2" : "top-full mt-2";

  // Inject aria-describedby into the trigger so the tooltip is announced
  // to assistive tech as a description, not the button's name.
  const trigger =
    isValidElement(children)
      ? cloneElement(
          children as ReactElement<{ "aria-describedby"?: string }>,
          { "aria-describedby": tooltipId },
        )
      : children;

  return (
    <span className={`relative inline-flex group/tip ${className}`}>
      {trigger}
      <span
        id={tooltipId}
        role="tooltip"
        className={`absolute ${positionClass} ${alignClass} px-2.5 py-[5px] bg-[var(--color-foreground)] text-[var(--color-background)] font-mono text-[10px] uppercase tracking-[0.14em] whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-md rounded-sm leading-none font-medium`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {text}
      </span>
    </span>
  );
}
