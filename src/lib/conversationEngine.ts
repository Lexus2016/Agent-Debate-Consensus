import { Model, Message } from "@/types/chat";

interface ResponseDecision {
  shouldRespond: boolean;
  delay: number;
  priority: number;
}

const MAX_PER_MODEL = 2; // Max responses per model between user messages
const MAX_MODERATOR_ROUNDS = 1; // Moderator speaks once per user message (final word)

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class ConversationEngine {
  private cooldowns: Map<string, number> = new Map();
  private responseQueue: Array<{ modelId: string; priority: number }> = [];
  private pendingModels: Set<string> = new Set();
  private maxConcurrent = 1;
  private currentlyResponding = 0;
  private onTriggerResponse?: (modelId: string) => void;
  private _roundComplete = false;

  setResponseHandler(handler: (modelId: string) => void) {
    this.onTriggerResponse = handler;
  }

  /**
   * Mark the current round as complete. Clears all pending/queued responses.
   * No further AI messages will be sent until startNewRound() is called.
   */
  markRoundComplete(): void {
    this._roundComplete = true;
    this.responseQueue = [];
    this.pendingModels.clear();
  }

  /**
   * Start a new round (called when user sends a message).
   * Resets the roundComplete flag so AI models can respond again.
   */
  startNewRound(): void {
    this._roundComplete = false;
  }

  get roundComplete(): boolean {
    return this._roundComplete;
  }

  /**
   * Count ALL consecutive AI messages since the last user message.
   */
  private countAiRoundsSinceUser(messages: Message[]): number {
    let count = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") break;
      if (messages[i].role === "assistant" && !messages[i].isStreaming) {
        count++;
      }
    }
    return count;
  }

  /**
   * Count how many times THIS specific model has responded since the last user message.
   */
  private countModelRoundsSinceUser(
    messages: Message[],
    modelId: string
  ): number {
    let count = 0;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") break;
      if (messages[i].modelId === modelId && !messages[i].isStreaming) {
        count++;
      }
    }
    return count;
  }

  analyzeForResponse(
    model: Model,
    messages: Message[],
    latestMessage: Message,
    activeModels: Model[],
    moderatorId?: string | null,
    failedModelIds?: Set<string>
  ): ResponseDecision {
    // ── Hard stop: round is complete, wait for user ──
    if (this._roundComplete) {
      return { shouldRespond: false, delay: 0, priority: 0 };
    }

    // Don't respond to own messages
    if (latestMessage.modelId === model.id) {
      return { shouldRespond: false, delay: 0, priority: 0 };
    }

    // Skip failed models
    if (failedModelIds?.has(model.id)) {
      return { shouldRespond: false, delay: 0, priority: 0 };
    }

    const isModerator = model.id === moderatorId;

    let priority = 0;
    let shouldRespond = false;

    // Highest priority: @mentioned — BYPASSES COOLDOWN and per-model limit
    const escaped = escapeRegex(model.shortName.toLowerCase());
    const mentionPattern = new RegExp(`@${escaped}\\b`, "i");
    const isMentioned = mentionPattern.test(latestMessage.content);

    if (isMentioned) {
      shouldRespond = true;
      priority = 100;
    }

    // Check cooldown (10 seconds) — but @mentions bypass this
    const lastResponse = this.cooldowns.get(model.id) || 0;
    const isOnCooldown = Date.now() - lastResponse < 10000;

    if (isOnCooldown && !isMentioned) {
      return { shouldRespond: false, delay: 0, priority: 0 };
    }

    const aiRounds = this.countAiRoundsSinceUser(messages);
    const modelRounds = this.countModelRoundsSinceUser(messages, model.id);

    // Count active non-moderator, non-failed models
    const nonModeratorCount = activeModels.filter(
      (m) => m.id !== moderatorId && !failedModelIds?.has(m.id)
    ).length;

    // ── CRITICAL: After moderator has spoken, STOP all non-moderator responses ──
    // The moderator's summary is the final word in each round.
    // Only a new user message or explicit @mention restarts the cycle.
    if (moderatorId && !isMentioned && !isModerator) {
      const moderatorHasSpoken = this.countModelRoundsSinceUser(messages, moderatorId) > 0;
      if (moderatorHasSpoken) {
        return { shouldRespond: false, delay: 0, priority: 0 };
      }
    }

    // ── Total AI round cap ──
    // With moderator: all non-mods respond once + 1 moderator summary
    // Without moderator: all models respond + limited rebuttals
    const maxTotalRounds = moderatorId
      ? nonModeratorCount + MAX_MODERATOR_ROUNDS
      : activeModels.length + 2;

    if (!isMentioned && aiRounds >= maxTotalRounds) {
      return { shouldRespond: false, delay: 0, priority: 0 };
    }

    // Per-model limit (unless @mentioned)
    if (!isMentioned && modelRounds >= MAX_PER_MODEL) {
      return { shouldRespond: false, delay: 0, priority: 0 };
    }

    // ── Moderator logic ──
    if (isModerator && !isMentioned) {
      // Moderator: max 1 response per round (final summary)
      if (modelRounds >= MAX_MODERATOR_ROUNDS) {
        return { shouldRespond: false, delay: 0, priority: 0 };
      }

      // Moderator responds to user messages (goes last, lower priority)
      if (latestMessage.role === "user") {
        shouldRespond = true;
        priority = 70;
      }
      // Moderator summarizes after non-moderator models have had their say
      else if (aiRounds >= Math.max(nonModeratorCount, 2)) {
        shouldRespond = true;
        priority = 90; // High priority for summary
      }
      // Moderator doesn't jump into mid-debate
      else {
        return { shouldRespond: false, delay: 0, priority: 0 };
      }

      const readingTime = Math.min(latestMessage.content.length * 15, 2000);
      const delay = 3000 + readingTime + Math.random() * 1500;
      return { shouldRespond, delay, priority };
    }

    // ── Non-moderator logic ──

    // High priority: User message — all active models respond
    if (!shouldRespond && latestMessage.role === "user") {
      shouldRespond = true;
      priority = 80;
    }

    // Medium priority: Another AI's message ends with a question
    if (!shouldRespond && /\?\s*$/.test(latestMessage.content.trim())) {
      shouldRespond = true;
      priority = 60;
    }

    // NOTE: No random trigger — models only respond when they have a reason
    // (user message, @mention, or question). This prevents echo chambers.

    // Calculate delay based on message length (simulate reading)
    const readingTime = Math.min(latestMessage.content.length * 15, 2000);
    const baseDelay = 1500 + Math.random() * 2000;
    const delay = baseDelay + readingTime;

    return { shouldRespond, delay, priority };
  }

  queueResponse(modelId: string, delay: number, priority: number): void {
    // Don't queue if round is complete, already queued, or currently responding
    if (this._roundComplete || this.pendingModels.has(modelId)) {
      return;
    }
    this.pendingModels.add(modelId);

    setTimeout(() => {
      // Bail if round ended or model was cleared while waiting
      if (this._roundComplete || !this.pendingModels.has(modelId)) {
        this.pendingModels.delete(modelId);
        return;
      }

      if (this.currentlyResponding < this.maxConcurrent) {
        this.triggerResponse(modelId);
      } else {
        // Insert in priority order
        const insertIndex = this.responseQueue.findIndex(
          (item) => item.priority < priority
        );
        if (insertIndex === -1) {
          this.responseQueue.push({ modelId, priority });
        } else {
          this.responseQueue.splice(insertIndex, 0, { modelId, priority });
        }
      }
    }, delay);
  }

  completeResponse(modelId: string): void {
    this.cooldowns.set(modelId, Date.now());
    this.currentlyResponding--;
    this.pendingModels.delete(modelId);

    // Don't process queue if round is complete
    if (this._roundComplete) {
      this.responseQueue = [];
      return;
    }

    if (this.responseQueue.length > 0) {
      const next = this.responseQueue.shift()!;
      this.triggerResponse(next.modelId);
    }
  }

  private triggerResponse(modelId: string): void {
    this.currentlyResponding++;
    this.onTriggerResponse?.(modelId);
  }

  isOnCooldown(modelId: string): boolean {
    const lastResponse = this.cooldowns.get(modelId) || 0;
    return Date.now() - lastResponse < 10000;
  }

  reset(): void {
    this.cooldowns.clear();
    this.responseQueue = [];
    this.pendingModels.clear();
    this.currentlyResponding = 0;
    this._roundComplete = false;
  }
}

export function buildSystemPrompt(
  model: Model,
  activeModels: Model[],
  isModerator: boolean = false
): string {
  const otherModels = activeModels
    .filter((m) => m.id !== model.id)
    .map((m) => m.shortName);

  const othersText =
    otherModels.length > 0
      ? `The other AI participants are: ${otherModels.join(", ")}.`
      : "You are the only AI in this chat.";

  if (isModerator) {
    return `You are ${model.name}, acting as the MODERATOR of this debate. ${othersText}

Your role as moderator:
- Guide the discussion — ask clarifying questions, redirect off-topic tangents
- After participants have debated, provide a concise summary of the key arguments
- Identify areas of agreement and remaining disagreements
- When consensus is reached, clearly state the conclusion with a justified final answer
- When the debate is exhausted (no new arguments), wrap up with a final summary
- You can address participants using @mentions (e.g., @${otherModels[0] || "User"})
- The human user has ultimate authority — follow their direction if they intervene
- Keep your moderator responses focused and structured
- Do NOT take sides in the debate — remain neutral and analytical

CRITICAL: Your summary CONCLUDES the round. After you summarize, participants will NOT respond further — the discussion pauses until the user speaks again. Make your summary comprehensive and final. End with a clear, justified conclusion that answers the original question.

CRITICAL LANGUAGE RULE: You MUST respond in the same language the user used in their message. If the user writes in Ukrainian, respond in Ukrainian. If in English, respond in English. Always match the user's language. This applies to all your responses without exception.`;
  }

  return `You are ${model.name}, participating in a structured debate with a human moderator${otherModels.length > 0 ? " and other AI models" : ""}.

${othersText}

Rules:
- Engage in thoughtful, substantive debate on the topic at hand
- Present your unique perspective with clear reasoning
- When you disagree with others, explain why respectfully and specifically
- Build on good arguments made by others — acknowledge strong points
- Work toward finding consensus where possible, but never agree superficially
- The human user is the moderator — they guide the discussion and can intervene at any time. Follow their direction.
- You can address others using @mentions (e.g., @${otherModels[0] || "User"})
- If directly addressed with @${model.shortName}, you must respond
- Keep responses focused and substantive (2-4 sentences usually, unless more detail is warranted)

CRITICAL STOP RULES:
- After the moderator summarizes the debate, DO NOT respond. The round is over. Wait for the user's next message.
- DO NOT write messages that only express agreement ("I agree", "Great point"). If you agree and have nothing new to add, stay silent.
- DO NOT write messages asking for a new topic or saying "ready for next topic". That is the user's decision.
- Only respond when you have a genuinely NEW argument, counterpoint, or insight to contribute.

CRITICAL LANGUAGE RULE: You MUST respond in the same language the user used in their message. If the user writes in Ukrainian, respond in Ukrainian. If in English, respond in English. Always match the user's language. This applies to all your responses without exception.`;
}

export function buildContextWindow(
  messages: Message[],
  windowSize: number,
  model: Model
): { role: "user" | "assistant" | "system"; content: string }[] {
  const recentMessages = messages.slice(-windowSize);
  const windowStartIdx = messages.length - windowSize;

  // Find the last user message in the full history
  let lastUserIdx = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      lastUserIdx = i;
      break;
    }
  }

  const result: { role: "user" | "assistant"; content: string }[] = [];

  // Pin the user's question if it was pushed out of the context window
  if (lastUserIdx >= 0 && lastUserIdx < windowStartIdx) {
    result.push({
      role: "user",
      content: messages[lastUserIdx].content,
    });
  }

  for (const msg of recentMessages) {
    if (msg.role === "user") {
      // User messages stay as user role
      result.push({ role: "user", content: msg.content });
    } else if (msg.modelId === model.id) {
      // Own previous messages -> assistant role (no prefix)
      result.push({ role: "assistant", content: msg.content });
    } else {
      // Other AI models' messages -> user role with name prefix
      // This helps the model distinguish external input from its own output
      result.push({
        role: "user",
        content: `[${msg.modelName}]: ${msg.content}`,
      });
    }
  }

  return result;
}

export const conversationEngine = new ConversationEngine();
