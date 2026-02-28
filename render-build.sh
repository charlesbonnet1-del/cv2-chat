#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

# Install Chromium dependencies for Render's Native Runtime
# This is required for Puppeteer to run
if [ "$RENDER" ]; then
  echo "Installing Chromium..."
  export PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer
  npx puppeteer browsers install chrome
fi
