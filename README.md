# Web QA Agent

A standalone desktop app that runs automated QA against HTML folders.

## Features

- **Folder Picker** — select any folder containing HTML files
- **Local Server** — auto-starts a local HTTP server for browser access
- **Rule-Based Checks** — broken images, missing alt text, low contrast, horizontal overflow, missing viewport meta, overlapping elements
- **AI Vision Pass** — screenshots sent to vision model for layout/text/visual analysis
- **Dual AI Support** — OpenRouter (cloud) or Ollama (local models like llava, llama3.2-vision)
- **Real-time Results** — live progress, screenshots, and issue reports

## Architecture

```
┌─────────────────────────────────────┐
│  Electron + React Frontend          │
│  - Folder picker                    │
│  - Config panel (OpenRouter/Ollama) │
│  - Results dashboard w/ screenshots │
│  - Live console logs                │
└──────────────┬──────────────────────┘
               │ spawn subprocess
┌──────────────▼──────────────────────┐
│  Python QA Engine (qa_engine.py)    │
│  1. Start local HTTP server         │
│  2. Playwright → screenshot + rules │
│  3. Vision AI → layout analysis     │
│  4. Stream JSON results → stdout    │
└─────────────────────────────────────┘
```

## Setup

```bash
# Install Node dependencies
npm install --legacy-peer-deps

# Install Python dependencies
pip3 install playwright requests
playwright install chromium

# For local models (optional)
# Install Ollama from https://ollama.com
# Pull a vision model: ollama pull llama3.2-vision
```

## Development

```bash
npm run electron:dev
```

## Build

```bash
npm run electron:build
```

## AI Configuration

### OpenRouter (default)
- Get API key from https://openrouter.ai/keys
- Supports: GPT-4o, Claude 3.5, Gemini, etc.
- Enter key in app UI or set `OPENROUTER_API_KEY` in `~/.hermes/.env`

### Ollama (local)
- Install Ollama and pull a vision model
- Default URL: `http://localhost:11434`
- Supported models: `llama3.2-vision`, `llava`, `bakllava`
