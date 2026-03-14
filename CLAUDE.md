# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Run production build
```

No test framework is configured. `next lint` is not available in Next.js 16 — use `npm run build` for TypeScript validation.

## Environment

Requires `OPENROUTER_API_KEY` in `.env` (get from https://openrouter.ai/keys).

## Architecture

Multi-agent debate platform: multiple LLMs engage in structured debates on any topic while the user moderates. Built on Next.js 16 App Router + TypeScript + Tailwind CSS v4 + Zustand.

### Core data flow

1. User sends message → `ChatContainer` writes to Zustand store → `ConversationEngine` decides which models respond
2. `ConversationEngine` queues responses sequentially (max 1 concurrent) with priority: @mention (100) > user message (80) > question (60) > random 15% (20)
3. Each response: API call to `/api/chat` → SSE stream via OpenAI SDK (configured for OpenRouter) → tokens update store → UI re-renders
4. Models have 10s cooldown between responses (bypassed by @mentions)
5. User can send messages at ANY time during debate (Send + Stop buttons shown simultaneously)

### Key modules

- **`src/lib/conversationEngine.ts`** — Response decision engine. Priority queue, cooldowns, reading delay simulation. `buildSystemPrompt()` dynamically tells each model about other active participants and debate rules. This is the brain of the app.
- **`src/lib/streamHandler.ts`** — Client-side SSE parser with per-model AbortController for cancellation.
- **`src/lib/exportChat.ts`** — Utilities for exporting full chat to Markdown file and copying individual messages as Markdown to clipboard.
- **`src/app/api/chat/route.ts`** — Backend streaming endpoint. Proxies to OpenRouter via OpenAI SDK. Emits `data: {content, reasoning}` SSE events.
- **`src/app/api/models/route.ts`** — Proxy to OpenRouter's model catalog for the discovery modal.
- **`src/store/chatStore.ts`** — Zustand store persisted to localStorage ("chat-storage"). Holds messages, activeModels, availableModels, typingModels, contextWindowSize.
- **`src/lib/models.ts`** — Default model definitions (Kimi K2, Gemini 3 Pro, Claude Haiku 4.5, Grok 4.1 Fast) with color assignments.

### Component hierarchy

`ChatContainer` is the orchestrator: glassmorphism sidebar (ActiveModels, ModelSelector + ModelDiscoveryModal, Export + New Debate buttons) and main area (MessageList → MessageBubble[], TypingIndicator, ChatInput). All interactive components use `"use client"`.

### Notable patterns

- **User intervention**: ChatInput always shows Send button, even during generation. Stop button appears alongside Send, not replacing it.
- **@mentions**: Regex-based detection, highlighted with model color in `MessageBubble`, bypasses cooldown in engine
- **Copy to clipboard**: Each MessageBubble has a hover-visible copy button that formats the message as Markdown
- **Export**: Full chat exportable as `.md` file from sidebar
- **Reasoning support**: Messages have optional `reasoning` field for extended-thinking models, displayed as collapsible section
- **Response delay**: Simulated reading time = 1500ms + (content_length * 15ms) + random 0-2000ms
- **Context window**: Last N messages (default 20) sent to each model, with attribution of which model said what

## Design system

Dark theme with indigo/violet accent palette. Key colors defined in `globals.css` via Tailwind v4 `@theme`:
- Background: `#09090b` (zinc-950)
- Primary: `#6366f1` (indigo-500)
- Accent: `#8b5cf6` (violet-500)
- Surface: `#18181b` (zinc-900)

Utility classes: `.glass` (backdrop-blur), `.gradient-text` (indigo→violet gradient text), `.animate-fade-in`.

## Conventions

- Import alias: `@/*` maps to `./src/*`
- Functional components with hooks only
- Tailwind utility classes; custom theme in `src/app/globals.css`
- All AI logic changes must align with `ConversationEngine` queue/priority system
