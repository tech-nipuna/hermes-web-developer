# Web QA Agent

A standalone desktop app that runs automated QA against HTML folders.

## Features

- **Folder Picker** — select any folder containing HTML files
- **Local Server** — auto-starts a local HTTP server for browser access
- **Playwright Browser Automation** — headless Chrome opens each page
- **Rule-Based Checks** — broken images, missing alt text, horizontal overflow, missing viewport meta, JavaScript errors, low contrast
- **AI Vision Pass** — screenshots sent to vision model for layout/text/visual/UX analysis
- **Dual AI Support** — OpenRouter (cloud) or Ollama (local models like llama3.2-vision)
- **Viewport Presets** — Mobile, Tablet, Desktop, Wide
- **Export Reports** — save as JSON or HTML with screenshots
- **Dark Theme UI** — Tailwind CSS styled dashboard

## Architecture

```
┌─────────────────────────────────────────┐
│  Electron + Vite + React Frontend       │
│  - Folder picker, config panel          │
│  - Results dashboard with screenshots   │
│  - Progress bar, console logs           │
└──────────────────┬──────────────────────┘
                   │ spawn subprocess
┌──────────────────▼──────────────────────┐
│  Python QA Engine (backend/)            │
│  1. Local HTTP server                   │
│  2. Playwright → screenshot + checks    │
│  3. Vision AI → analysis                │
│  4. Stream JSON → stdout                │
└─────────────────────────────────────────┘
```

## Quick Start

```bash
# One-time setup
chmod +x setup.sh
./setup.sh

# Run in development mode
npm run electron:dev

# Build production package (.deb for Raspberry Pi / Linux)
npm run electron:build
```

## Raspberry Pi Specific

The Pi runs headless, so you need a virtual display:

```bash
# Install Xvfb
sudo apt install xvfb

# Run with virtual display
Xvfb :99 -screen 0 1280x1024x24 &
DISPLAY=:99 npm run electron:dev
```

## AI Configuration

### OpenRouter (Cloud)
1. Get API key at https://openrouter.ai/keys
2. Enter in app UI or set `OPENROUTER_API_KEY` environment variable
3. Models: `openai/gpt-4o-mini`, `anthropic/claude-3-5-sonnet`, `google/gemini-2.0-flash-001`

### Ollama (Local — No API Key Needed)
1. Install Ollama: https://ollama.com
2. Pull a vision model:
   ```bash
   ollama pull llama3.2-vision
   # or
   ollama pull llava
   ```
3. Select "Ollama" in app UI
4. Default URL: `http://localhost:11434`

## Development

```bash
# Frontend only (hot reload)
npm run dev

# Full Electron + frontend
npm run electron:build

# Build for production (creates .deb + AppImage in ./release/)
```

## File Structure

```
qa-desktop-app/
├── electron/              # Electron main process
│   ├── main.ts           # Window creation, IPC, subprocess
│   ├── preload.js        # Bridge between renderer and main
│   └── tsconfig.json
├── src/                   # React frontend
│   ├── App.tsx           # Main app component
│   ├── components/       # UI components
│   └── types.ts          # TypeScript interfaces
├── backend/               # Python QA engine
│   ├── qa_engine.py      # Server, Playwright, AI vision
│   ├── requirements.txt  # Python deps
│   └── .venv/            # Virtual environment
├── assets/                # App icons
├── setup.sh              # One-time setup script
└── package.json          # Node deps + electron-builder config
```

## License
MIT
