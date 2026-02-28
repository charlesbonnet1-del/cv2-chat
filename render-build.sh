#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

# Install Chromium dependencies for Render's Native Runtime
if [ "$RENDER" ]; then
  echo "Installing Chromium..."
  # Use Render's persistent cache directory
  export PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
  npx puppeteer browsers install chrome
fi
