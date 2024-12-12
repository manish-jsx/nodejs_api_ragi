#!/bin/bash

# Source NVM (if you're not using full paths)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

cd /home/ubuntu/nodejs_api_ragi

# Pull the latest changes
git pull origin main

# Install/update dependencies
npm install

# Restart your Node.js app (using pm2)
npx pm2 restart api

# Optional: Log the update
echo "Updated API at $(date)" >> /home/ubuntu/nodejs_api_ragi/update.log