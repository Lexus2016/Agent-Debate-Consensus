/**
 * Token estimation and context budget management.
 *
 * Uses a simple heuristic (~4 chars per token for English, ~2 for CJK/Cyrillic)
 * which is accurate within ~10-15% for most models. Good enough for budgeting
 * without pulling in a 2MB tokenizer library.
 */

// Average chars-per-token ratio. English prose ≈ 4, code ≈ 3.5, CJK ≈ 1.5.
// We use a conservative 3.5 to slightly overestimate token count (safer for budgeting).
const CHARS_PER_TOKEN = 3.5;

/** Estimate token count for a string. Conservative (overestimates slightly). */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/**
 * Known context window sizes for popular models (in tokens).
 * Falls back to a conservative default for unknown models.
 */
const MODEL_CONTEXT_LIMITS: Record<string, number> = {
  // OpenAI
  "openai/gpt-4o": 128_000,
  "openai/gpt-4o-mini": 128_000,
  "openai/gpt-4.1": 1_047_576,
  "openai/gpt-4.1-mini": 1_047_576,
  "openai/gpt-4.1-nano": 1_047_576,
  "openai/gpt-5.4-pro": 256_000,
  // Google
  "google/gemini-2.5-pro-preview": 1_048_576,
  "google/gemini-2.5-flash-preview": 1_048_576,
  "google/gemini-2.0-flash-001": 1_048_576,
  "google/gemini-3-pro": 2_000_000,
  // Anthropic
  "anthropic/claude-sonnet-4": 200_000,
  "anthropic/claude-haiku-4": 200_000,
  "anthropic/claude-4-haiku": 200_000,
  "anthropic/claude-4.5-haiku": 200_000,
  // xAI
  "x-ai/grok-4.1-fast": 131_072,
  "x-ai/grok-3-mini-beta": 131_072,
  // DeepSeek
  "deepseek/deepseek-chat-v3-0324:free": 163_840,
  "deepseek/deepseek-r1:free": 163_840,
  // Kimi
  "moonshotai/kimi-k2": 131_072,
};

const DEFAULT_CONTEXT_LIMIT = 64_000; // Conservative fallback

/** Get model's context window limit in tokens. */
export function getModelContextLimit(modelId: string): number {
  return MODEL_CONTEXT_LIMITS[modelId] ?? DEFAULT_CONTEXT_LIMIT;
}

/**
 * Maximum tokens to allocate for the completion (response).
 * We cap at 4096 for debate responses — most debate messages are 200-800 tokens.
 * This prevents the "can't afford" error from OpenRouter.
 */
export const MAX_COMPLETION_TOKENS = 4096;

/**
 * Calculate available token budget for the prompt (system + context messages).
 *
 * Formula: min(contextLimit, hardCap) - completionReserve - safetyMargin
 *
 * @param modelId - The model being called
 * @param hardCap - Optional hard cap on total tokens (e.g., from account budget)
 * @returns Available tokens for system prompt + conversation messages
 */
export function getPromptBudget(modelId: string, hardCap?: number): number {
  const contextLimit = getModelContextLimit(modelId);
  const effectiveLimit = hardCap ? Math.min(contextLimit, hardCap) : contextLimit;

  // Reserve tokens for completion + safety margin (10%)
  const safetyMargin = Math.ceil(effectiveLimit * 0.05);
  return effectiveLimit - MAX_COMPLETION_TOKENS - safetyMargin;
}

/**
 * Truncate a message to fit within a token budget.
 * Preserves the beginning (most important context) and adds a truncation marker.
 */
export function truncateToTokenBudget(text: string, maxTokens: number): string {
  const estimated = estimateTokens(text);
  if (estimated <= maxTokens) return text;

  const maxChars = Math.floor(maxTokens * CHARS_PER_TOKEN);
  // Find a clean break point (sentence or paragraph boundary)
  const truncated = text.slice(0, maxChars);
  const lastPeriod = truncated.lastIndexOf(". ");
  const lastNewline = truncated.lastIndexOf("\n");
  const breakPoint = Math.max(lastPeriod, lastNewline);

  if (breakPoint > maxChars * 0.5) {
    return truncated.slice(0, breakPoint + 1) + "\n[...truncated]";
  }
  return truncated + "... [truncated]";
}

/**
 * Compress a message for context window inclusion.
 * Used for older messages that need to be summarized to save tokens.
 *
 * Strategy:
 * - Very short messages (< 100 tokens): keep as-is
 * - Medium messages (100-300 tokens): light truncation
 * - Long messages (300+ tokens): aggressive truncation to ~150 tokens
 */
export function compressMessage(content: string, isRecent: boolean): string {
  const tokens = estimateTokens(content);

  // Recent messages: keep in full up to a generous limit
  if (isRecent) {
    return tokens > 1500 ? truncateToTokenBudget(content, 1500) : content;
  }

  // Older messages: compress more aggressively
  if (tokens <= 80) return content;
  if (tokens <= 250) return truncateToTokenBudget(content, 200);
  return truncateToTokenBudget(content, 150);
}
