#!/usr/bin/env bash
# exit on error
set -o errexit

# Ensure Puppeteer downloads Chrome to the local project directory
# so it persists between the build container and runtime container
export PUPPETEER_CACHE_DIR=$PWD/.cache/puppeteer

# Install dependencies
npm install

# Force puppeteer to install the browser
npx puppeteer install

npm run build

