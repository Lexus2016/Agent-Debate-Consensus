# Agent Debate Consensus

Multi-agent debate platform — AI models discuss, argue, and find consensus while you moderate.

🇬🇧 [English](README.md) | 🇷🇺 [Русский](README.ru.md) | 🇺🇦 [Українська](README.uk.md)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Why Agent Debate Consensus?

A single AI gives you one perspective. Agent Debate Consensus gives you four — simultaneously, in real time, arguing with each other.

Different models have different training data, different biases, and different reasoning styles. By forcing them to debate a topic and defend their positions against each other, you get a more complete picture than any single model could provide. Contradictions surface. Weak arguments get challenged. Consensus, when it emerges, is earned.

Use it to stress-test an idea, explore a controversial topic from multiple angles, or simply watch state-of-the-art models push each other toward better answers.

---

## Features

- **Multi-Agent Debates**: Up to 4+ AI agents (Kimi K2, Gemini 3 Pro, Claude Haiku 4.5, Grok 4.1 Fast) engage in structured debate simultaneously
- **Real-time Streaming**: Token-by-token response streaming via Server-Sent Events — no waiting for complete responses
- **@Mention System**: Direct questions to specific agents with `@Kimi`, `@Gemini`, `@Claude`, `@Grok`
- **Moderator Role**: Intervene at any point to redirect the debate, add context, or push agents toward resolution
- **Smart Response Engine**: Priority-based queuing with cooldowns prevents agents from talking over each other
- **Agent Discovery**: Browse and add 400+ models from OpenRouter's catalog
- **Extended Thinking**: Full support for models with reasoning/chain-of-thought capabilities
- **Export to Markdown**: Download the entire debate as a `.md` file for documentation or sharing
- **Copy Messages**: Copy any individual message to clipboard in Markdown format
- **Persistent Sessions**: Conversations saved to localStorage — pick up where you left off
- **Dark Theme**: Premium modern dark UI built for long sessions

---

## How It Works

1. **Topic injection** — You introduce a topic or question. All active agents receive it as context.
2. **Structured responses** — Each agent formulates an independent position, unaware of what others are drafting.
3. **Cross-pollination** — Subsequent rounds include prior agent responses in each agent's context, enabling genuine reaction and rebuttal.
4. **Moderation** — You intervene at any point: clarify terms, challenge a weak argument, or ask a specific agent to defend their position.
5. **Convergence** — Through iterative exchange, agents refine positions, acknowledge stronger arguments, and move toward consensus — or surface irreconcilable differences worth knowing about.

---

## Setup

**1. Clone the repository**

```bash
git clone https://github.com/Lexus2016/Agent-Debate-Consensus.git
cd Agent-Debate-Consensus
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment**

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=your_key_here
```

Get your API key from [openrouter.ai/keys](https://openrouter.ai/keys).

**4. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Usage

1. Select AI agents from the sidebar
2. Type a topic or question to start the debate
3. Watch agents discuss, argue, and build on each other's points
4. Use `@mentions` to direct questions to specific agents
5. Intervene anytime to steer the discussion or add your perspective
6. Agents work toward consensus through structured dialogue

---

## Available Agents

| Agent | Provider | @Mention |
|-------|----------|----------|
| Kimi K2 | Moonshot AI | `@Kimi` |
| Gemini 3 Pro | Google | `@Gemini` |
| Claude Haiku 4.5 | Anthropic | `@Claude` |
| Grok 4.1 Fast | xAI | `@Grok` |
| 400+ more | OpenRouter catalog | via Agent Discovery |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| State management | Zustand |
| AI routing | OpenRouter API (via OpenAI SDK) |
| Streaming | Server-Sent Events (SSE) |

---

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint
```

---

## License

MIT — see [LICENSE](LICENSE) for details.

**Author:** [Lexus2016](https://github.com/Lexus2016)
