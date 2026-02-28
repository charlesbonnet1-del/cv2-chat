#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

# Install Chromium dependencies for Render's Native Runtime
# This is required for Puppeteer to run
if [ "$RENDER" ]; then
  echo "Installing Chromium dependencies..."
  # Render's Ubuntu environment might need these:
  # (Actually, standard puppeteer usually downloads its own chromium, 
  # but needs system libs like libnss3, libatk, etc.)
  # Most of these are pre-installed on Render, but we can ensure them if needed via a Dockerfile.
  # For Native Runtime, we rely on standard puppeteer's auto-download.
fi
