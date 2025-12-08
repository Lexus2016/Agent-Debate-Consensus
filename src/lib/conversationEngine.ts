import { Model, Message } from "@/types/chat";

interface ResponseDecision {
  shouldRespond: boolean;
  delay: number;
  priority: number;
}

export class ConversationEngine {
  private cooldowns: Map<string, number> = new Map();
  private responseQueue: Array<{ modelId: string; priority: number }> = [];
  private pendingModels: Set<string> = new Set(); // Track models waiting to respond
  private maxConcurrent = 1;
  private currentlyResponding = 0;
  private onTriggerResponse?: (modelId: string) => void;

  setResponseHandler(handler: (modelId: string) => void) {
    this.onTriggerResponse = handler;
  }

  analyzeForResponse(
    model: Model,
    messages: Message[],
    latestMessage: Message,
    activeModels: Model[]
  ): ResponseDecision {
    // Don't respond to own messages
    if (latestMessage.modelId === model.id) {
      return { shouldRespond: false, delay: 0, priority: 0 };
    }

    let priority = 0;
    let shouldRespond = false;

    // Highest priority: @mentioned - BYPASSES COOLDOWN
    const mentionPattern = new RegExp(`@${model.shortName.toLowerCase()}\\b`, "i");
    const isMentioned = mentionPattern.test(latestMessage.content);

    if (isMentioned) {
      shouldRespond = true;
      priority = 100;
    }

    // Check cooldown (10 seconds) - but @mentions bypass this
    const lastResponse = this.cooldowns.get(model.id) || 0;
    const isOnCooldown = Date.now() - lastResponse < 10000;

    if (isOnCooldown && !isMentioned) {
      return { shouldRespond: false, delay: 0, priority: 0 };
    }

    // High priority: User message
    if (!shouldRespond && latestMessage.role === "user") {
      shouldRespond = true;
      priority = 80;
    }

    // Medium priority: Question asked (and not already responding to mention)
    if (!shouldRespond && latestMessage.content.includes("?")) {
      shouldRespond = true;
      priority = 60;
    }

    // Low priority: Random chance (15%)
    if (!shouldRespond && Math.random() < 0.15) {
      shouldRespond = true;
      priority = 20;
    }

    // Calculate delay based on message length (simulate reading)
    const readingTime = Math.min(latestMessage.content.length * 15, 2000);
    const baseDelay = 1500 + Math.random() * 2000;
    const delay = baseDelay + readingTime;

    return { shouldRespond, delay, priority };
  }

  queueResponse(modelId: string, delay: number, priority: number): void {
    // Don't queue if already queued or currently responding
    if (this.pendingModels.has(modelId)) {
      return;
    }
    this.pendingModels.add(modelId);

    setTimeout(() => {
      // Double-check still pending (might have been cleared by stop)
      if (!this.pendingModels.has(modelId)) {
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
  }
}

export function buildSystemPrompt(model: Model, activeModels: Model[]): string {
  const otherModels = activeModels
    .filter((m) => m.id !== model.id)
    .map((m) => m.shortName);

  const othersText =
    otherModels.length > 0
      ? `The other AI participants are: ${otherModels.join(", ")}.`
      : "You are the only AI in this chat.";

  return `You are ${model.name}, participating in a group chat with a human user${otherModels.length > 0 ? " and other AI models" : ""}.

${othersText}

Rules:
- Be conversational and natural, like a group chat
- Keep responses concise (2-4 sentences usually, unless asked for more detail)
- You can address others using @mentions (e.g., @${otherModels[0] || "User"})
- Don't repeat what others have said
- Feel free to disagree, build on others' points, or ask follow-up questions
- If directly addressed with @${model.shortName}, you must respond
- Be yourself - show personality and engage naturally`;
}

export function buildContextWindow(
  messages: Message[],
  windowSize: number,
  model: Model
): { role: "user" | "assistant" | "system"; content: string }[] {
  const recentMessages = messages.slice(-windowSize);

  return recentMessages.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content:
      msg.modelId && msg.modelId !== model.id
        ? `[${msg.modelName}]: ${msg.content}`
        : msg.content,
  }));
}

export const conversationEngine = new ConversationEngine();
