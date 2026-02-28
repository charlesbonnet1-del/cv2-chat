#!/usr/bin/env bash
# exit on error
set -o errexit

# Ensure Puppeteer downloads Chrome to the persistent cache directory
export PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer

# Install dependencies; Puppeteer's postinstall will download Chrome to the cache dir
npm install

# Force puppeteer to install the browser again just in case the cache was cleared
npx puppeteer install

npm run build

