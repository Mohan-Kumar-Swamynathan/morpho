# Morpho - AI-Native Design Platform

> **"Morph your ideas into UI. With any AI. Export real code."**

Morpho is an open-source, LLM-agnostic design + development platform.
Think Figma — but AI is the core engine, not a plugin.
No vendor lock-in. No API key lock-in. Just pure creative velocity.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## Features

- 🎨 **Visual Canvas** - Infinite canvas with zoom, pan, multi-select
- 🤖 **AI Generation** - Generate UI from prompts using any LLM
- 📸 **Image to UI** - Convert screenshots to editable canvas
- 💻 **Code Export** - Export to React + Tailwind, HTML + CSS
- 🔌 **LLM Agnostic** - Use OpenAI, Anthropic, Ollama, or any model
- 👥 **Real-time Collaboration** - Built on Y.js CRDT
- 🐳 **Self-hostable** - Docker Compose for easy deployment

## Quick Start

```bash
# Clone the repository
git clone https://github.com/morpho-design/morpho
cd morpho

# Install dependencies
npm install

# Start development
npm run dev
```

Open http://localhost:3000 to see Morpho in action.

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# AI Providers (optional - users can configure per-project)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Database
DATABASE_URL=postgresql://morpho:morpho@localhost:5432/morpho
```

## Docker

```bash
# Start all services
docker compose up -d

# Access at http://localhost:3000
```

## Architecture

```
morpho/
├── apps/
│   ├── web/          # React frontend (Vite)
│   └── server/       # Fastify backend
├── packages/
│   ├── llm-core/     # LLM abstraction layer
│   ├── canvas-core/  # Konva.js canvas engine
│   ├── canvas-json/  # CanvasJSON schema + Zod
│   ├── code-gen/     # Code generation
│   ├── ui/           # Shared React components
│   └── design-tokens/# Design tokens
```

## Supported AI Providers

| Provider | Models | Auth |
|----------|--------|------|
| **OpenAI** | GPT-4o, GPT-4-turbo | API Key |
| **Anthropic** | Claude Sonnet, Opus | API Key |
| **Ollama** | Llama 3, Mistral, LLaVA | Local |
| **OpenRouter** | 100+ models | API Key |

## Tech Stack

- **Frontend**: React 18, Vite, Konva.js, Tailwind CSS
- **State**: Zustand
- **Backend**: Fastify, Node.js
- **Collaboration**: Y.js CRDT
- **AI**: OpenAI, Anthropic, Ollama

## License

AGPL-3.0 - See [LICENSE](LICENSE) for details.

---

*Built in public. Owned by the community.*
