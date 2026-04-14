# Morpho - AI-Native Design Platform

<p align="center">
  <img src="https://img.shields.io/github/stars/morpho-design/morpho?style=social" alt="Stars">
  <img src="https://img.shields.io/github/forks/morpho-design/morpho?style=social" alt="Forks">
  <img src="https://img.shields.io/github/license/morpho-design/morpho" alt="License">
  <img src="https://img.shields.io/github/issues/morpho-design/morpho" alt="Issues">
</p>

> **"Morph your ideas into UI. With any AI. Export real code."**

Morpho is an open-source, LLM-agnostic design + development platform. Think Figma — but AI is the core engine, not a plugin. No vendor lock-in. No API key lock-in. Just pure creative velocity.

<!-- SEO Keywords: AI design tool, Figma alternative, open source design tool, AI UI generator, React code export, Tailwind CSS generator, LLM design tool, no-code UI builder, visual design platform -->

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Visual Canvas** | Infinite canvas with zoom, pan, multi-select, shapes, text, frames |
| 🤖 **AI Generation** | Generate UI from prompts using any LLM (OpenAI, Anthropic, Ollama) |
| 📸 **Image to UI** | Convert screenshots to editable canvas with vision models |
| 💻 **Code Export** | Export to React + Tailwind, HTML + CSS instantly |
| 🔌 **LLM Agnostic** | Use OpenAI, Anthropic, Ollama, or any OpenAI-compatible model |
| 👥 **Real-time Collaboration** | Built on Y.js CRDT for conflict-free concurrent editing |
| 🐳 **Self-hostable** | Docker Compose for easy deployment |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Mohan-Kumar-Swamynathan/morpho.git
cd morpho

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:3000** to start designing.

## 🎯 Use Cases

- **Developers**: Quickly generate UI components from prompts
- **Designers**: AI-assisted design iteration
- **Founders**: Rapid prototyping without design skills
- **Teams**: Collaborative UI design with real-time editing

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React 18, Vite, Konva.js, Tailwind CSS |
| State Management | Zustand |
| Canvas Engine | Konva.js (react-konva) |
| Backend | Fastify, Node.js |
| AI | OpenAI, Anthropic, Ollama |
| Collaboration | Y.js CRDT |
| Deployment | Docker Compose |

## 🔌 Supported AI Providers

| Provider | Models | Auth Type |
|----------|--------|-----------|
| **OpenAI** | GPT-4o, GPT-4-turbo, GPT-4-vision | API Key (BYOK) |
| **Anthropic** | Claude Sonnet, Claude Opus, Haiku | API Key (BYOK) |
| **Ollama** | Llama 3, Mistral, LLaVA (local models) | Local |
| **OpenRouter** | 100+ models via single API | API Key (BYOK) |

## 🏗️ Architecture

```
morpho/
├── apps/
│   ├── web/              # React frontend (Vite)
│   └── server/           # Fastify backend API
├── packages/
│   ├── llm-core/         # LLM abstraction layer
│   ├── canvas-core/     # Konva.js canvas engine
│   ├── canvas-json/     # CanvasJSON schema + validators
│   ├── code-gen/        # Design to code generation
│   ├── collab-engine/   # Y.js collaboration
│   ├── ui/              # Shared React components
│   └── design-tokens/   # Design tokens system
├── docker-compose.yml   # Production deployment
└── docker-compose.dev.yml # Development environment
```

## 🐳 Docker Deployment

```bash
# Clone and navigate to project
git clone https://github.com/Mohan-Kumar-Swamynathan/morpho.git
cd morpho

# Start all services
docker compose up -d

# Access at http://localhost:3000
```

## ⚙️ Environment Variables

Copy `.env.example` to `.env`:

```bash
# App Configuration
APP_URL=http://localhost:3000
JWT_SECRET=your-secret

# Database (optional for v1)
DATABASE_URL=postgresql://morpho:morpho@postgres:5432/morpho

# AI Providers (optional - users configure per-project)
DEFAULT_LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## 📦 NPM Packages (Published)

| Package | Description |
|---------|-------------|
| `@morpho/llm-core` | LLM abstraction with OpenAI, Anthropic, Ollama support |
| `@morpho/canvas-json` | CanvasJSON schema with Zod validation |
| `@morpho/canvas-core` | Konva.js wrapper for canvas operations |
| `@morpho/code-gen` | Design to code generation (React, HTML, CSS) |

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/amazing-feature
# Commit your changes
git commit -m 'Add amazing feature'
# Push to branch
git push origin feature/amazing-feature
# Open a Pull Request
```

## 📄 License

**AGPL-3.0** - See [LICENSE](LICENSE) for details.

- ✅ Self-host freely, forever
- ✅ Fork and modify freely
- ✅ Community contributions welcome
- ❌ Cannot offer as closed-source SaaS without commercial license

This license model is proven by successful open-source projects: Penpot, Gitea, Plausible, Grafana.

## 🌐 Keywords (SEO)

AI design tool, Figma alternative, open source design tool, AI UI generator, React code export, Tailwind CSS generator, LLM design tool, no-code UI builder, visual design platform, design to code, AI-powered prototyping, self-hosted design tool, Docker design application

## 🔗 Links

- [Documentation](docs/)
- [Issues](https://github.com/Mohan-Kumar-Swamynathan/morpho/issues)
- [Discussions](https://github.com/Mohan-Kumar-Swamynathan/morpho/discussions)

---

<p align="center">
  <strong>Built in public. Owned by the community. 🦋</strong>
</p>