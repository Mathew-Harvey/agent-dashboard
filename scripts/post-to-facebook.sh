#!/bin/bash
# Post to Facebook Page using Graph API
# Requires: FB_PAGE_ACCESS_TOKEN, FB_PAGE_ID in .env

set -e

# Load environment variables
if [ -f "/home/mat/.openclaw/workspace/.env" ]; then
  source "/home/mat/.openclaw/workspace/.env"
fi

if [ -z "$FB_PAGE_ACCESS_TOKEN" ] || [ -z "$FB_PAGE_ID" ]; then
  echo "❌ Error: FB_PAGE_ACCESS_TOKEN and FB_PAGE_ID must be set in .env"
  exit 1
fi

MESSAGE="$1"
if [ -z "$MESSAGE" ]; then
  echo "Usage: $0 \"Your message here\""
  exit 1
fi

# Post to Facebook Page
RESPONSE=$(curl -s -X POST \
  "https://graph.facebook.com/v21.0/${FB_PAGE_ID}/feed" \
  -d "message=${MESSAGE}" \
  -d "access_token=${FB_PAGE_ACCESS_TOKEN}")

POST_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$POST_ID" ]; then
  echo "❌ Facebook post failed:"
  echo "$RESPONSE"
  exit 1
else
  echo "✅ Posted to Facebook! Post ID: $POST_ID"
  echo "$RESPONSE"
fi
