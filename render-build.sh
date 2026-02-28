#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

# Install Chromium dependencies for Render's Native Runtime
if [ "$RENDER" ]; then
  echo "Installing Chromium..."
  # The .puppeteerrc.cjs file will direct the cache to the local .cache folder
  npx puppeteer browsers install chrome
fi
