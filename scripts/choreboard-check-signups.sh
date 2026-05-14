#!/bin/bash
# Check Choreboard.io for new signups
# Requires admin API access (TBD)

set -e

WORKSPACE="/home/mat/.openclaw/workspace"
source "$WORKSPACE/.choreboard-credentials"

# For now, just verify our session is still valid
echo "Checking Choreboard.io session..."
RESULT=$(curl -s https://api.choreboard.io/api/auth/me \
  -H "Authorization: Bearer $SESSION_TOKEN")

STATUS=$(echo "$RESULT" | jq -r '.principal.kind // "error"')

if [ "$STATUS" = "parent" ]; then
  echo "✅ Session valid"
  echo "$RESULT" | jq .
else
  echo "❌ Session invalid or expired"
  echo "$RESULT"
  exit 1
fi

# TODO: Once admin endpoints exist, query:
# - Total families
# - New signups today
# - Active users
# - Chores completed
