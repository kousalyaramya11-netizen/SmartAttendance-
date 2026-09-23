#!/usr/bin/env bash

# AI-Based Smart Attendance System - Quick Start Script

echo "=========================================================="
echo "🎓 Starting AI-Based Smart Student Attendance System"
echo "=========================================================="
echo ""

# Ensure NVM / Node is available if installed
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not found on your system."
    echo "Please install Node.js from https://nodejs.org/ or run:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 First time setup: Installing dependencies..."
    npm install
fi

echo ""
echo "🚀 Launching the Frontend Website..."
echo "👉 Opening your browser to http://localhost:5173"
echo "👉 Press Ctrl + C in this terminal to stop the server anytime."
echo "=========================================================="
echo ""

npm run dev
