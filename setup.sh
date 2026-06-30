#!/bin/bash
set -e

echo "=== Web QA Agent - Setup Script ==="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: python3 not found"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "ERROR: node not found"
    exit 1
fi

cd "$(dirname "$0")"

# 1. Install Node dependencies
echo "[1/5] Installing Node.js dependencies..."
npm install --legacy-peer-deps

# 2. Install Electron app deps (for native modules)
echo "[2/5] Installing Electron app deps..."
npx electron-builder install-app-deps 2>/dev/null || echo "  (skipped - will build on package)"

# 3. Create Python virtual environment
echo "[3/5] Creating Python virtual environment..."
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install playwright requests

# 4. Install Playwright Chromium
echo "[4/5] Installing Playwright Chromium browser..."
python3 -m playwright install chromium
python3 -m playwright install-deps chromium 2>/dev/null || echo "  (system deps may need manual install)"

# 5. Build frontend
echo "[5/5] Building frontend..."
cd ..
npm run build

echo ""
echo "=== Setup complete! ==="
echo ""
echo "To run in development:"
echo "  npm run electron:dev"
echo ""
echo "To build production package (.deb/.AppImage):"
echo "  npm run electron:build"
echo ""
echo "Output will be in ./release/"
