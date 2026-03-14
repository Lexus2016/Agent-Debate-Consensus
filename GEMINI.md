# Agent Debate Consensus - Project Context

This project is a multi-agent debate platform where multiple AI models engage in structured discussions. The user acts as a moderator who can intervene, guide the debate, and steer conversations toward consensus.

## Technical Overview

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **AI Integration**: OpenRouter API via OpenAI SDK
- **Streaming**: Server-Sent Events (SSE) for token-by-token responses

## Architecture & Logic

### Core Components
- **ChatContainer**: The main orchestrator that manages the flow of messages and triggers the conversation engine.
- **Conversation Engine (`src/lib/conversationEngine.ts`)**:
    - Analyzes messages to decide which models should respond.
    - Implements a priority-based queuing system (Mentions > User Message > Random/Contextual).
    - Handles cooldowns (10s per model) and simulated reading delays.
    - Builds system prompts dynamically to inform models about other participants and debate rules.
- **Store (`src/store/chatStore.ts`)**: Centralized state for messages, active models, and typing indicators using Zustand.
- **API (`src/app/api/chat/route.ts`)**: A streaming endpoint that proxies requests to OpenRouter.
- **Export (`src/lib/exportChat.ts`)**: Utility for exporting chat to Markdown and copying individual messages.

### Key Data Structures (`src/types/chat.ts`)
- `Model`: Defines AI model properties (id, name, shortName, color, etc.).
- `Message`: Extends standard LLM message structure with `modelId`, `isStreaming`, and `timestamp`.

## Development Workflows

### Environment Setup
Requires an `OPENROUTER_API_KEY` in a `.env` file.

### Commands
- `npm run dev`: Starts the development server at `http://localhost:3000`.
- `npm run build`: Creates a production build.
- `npm run lint`: Runs ESLint for code quality checks.

### Conventions
- **Imports**: Use the `@/` alias to reference the `src/` directory.
- **Components**: Functional components with hooks; prefer modularity.
- **Styling**: Tailwind utility classes; custom animations are defined in `globals.css`.
- **AI Logic**: When adding features, ensure they align with the `ConversationEngine` logic for response triggering and queuing.

## Key Files for Reference
- `src/lib/conversationEngine.ts`: Logic for AI debate behavior and response scheduling.
- `src/lib/exportChat.ts`: Chat export and message copy utilities.
- `src/store/chatStore.ts`: Global state management.
- `src/app/api/chat/route.ts`: Backend streaming implementation.
- `src/lib/models.ts`: List of available models and their configurations.
