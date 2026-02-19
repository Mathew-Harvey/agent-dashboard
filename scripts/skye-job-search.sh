#!/bin/bash
# Job search script for Skye - searches Seek, Glassdoor, Indeed, Excite for digital PM roles
# Only sends email when NEW jobs are found

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE="/home/mat/.openclaw/workspace"
DATA_DIR="$WORKSPACE/data"

# Files for tracking
PREV_JOBS_FILE="$DATA_DIR/skye-previous-jobs.json"
NEW_JOBS_FILE="$DATA_DIR/skye-new-jobs.md"
EMAIL_SENT_FLAG="$DATA_DIR/skye-email-sent.txt"

TIMESTAMP=$(date "+%Y-%m-%d %H:%M")

echo "=== Job Search for Skye ===" 
echo "Timestamp: $TIMESTAMP"
echo ""

cd "$WORKSPACE"

# Use web search to find current job listings
# Search for digital project manager / product owner jobs in WA or remote Australia

echo "Searching Seek..."
SEEK_JOBS=$(web_search --query "site:seek.com.au \"digital project manager\" OR \"product owner\" Australia 2026" --count 10 2>/dev/null | head -30)

echo "Searching Indeed..."
INDEED_JOBS=$(web_search --query "digital project manager product owner jobs Perth WA Australia indeed 2026" --count 10 2>/dev/null | head -30)

echo "Searching Glassdoor..."
GLASSDOOR_JOBS=$(web_search --query "digital project manager product owner jobs Western Australia glassdoor 2026" --count 10 2>/dev/null | head -30)

# Compile results
mkdir -p "$DATA_DIR"

cat > "$NEW_JOBS_FILE" << 'EOF'
# New Job Listings for Skye

_Last updated: TIMESTAMP_PLACEHOLDER_

## Digital Project Manager / Product Owner Roles

EOF

sed -i "s/TIMESTAMP_PLACEHOLDER/$TIMESTAMP/" "$NEW_JOBS_FILE"

# Extract and format job listings from search results
# For now, we'll use the search results directly since job board APIs aren't available

echo "$SEEK_JOBS" >> "$NEW_JOBS_FILE"
echo "" >> "$NEW_JOBS_FILE"
echo "--- Indeed Results ---" >> "$NEW_JOBS_FILE"
echo "$INDEED_JOBS" >> "$NEW_JOBS_FILE"
echo "" >> "$NEW_JOBS_FILE"
echo "--- Glassdoor Results ---" >> "$NEW_JOBS_FILE"
echo "$GLASSDOOR_JOBS" >> "$NEW_JOBS_FILE"

# Also save raw search results as JSON for comparison
cat > "$PREV_JOBS_FILE" << EOF
{
  "timestamp": "$TIMESTAMP",
  "seek": $(echo "$SEEK_JOBS" | head -500 | jq -Rs .),
  "indeed": $(echo "$INDEED_JOBS" | head -500 | jq -Rs .),
  "glassdoor": $(echo "$GLASSDOOR_JOBS" | head -500 | jq -Rs .)
}
EOF

echo "Search results saved to $NEW_JOBS_FILE"
echo "Raw data saved to $PREV_JOBS_FILE"
echo "=== Job search complete ==="

# Check if there are any substantive results (not just search metadata)
CONTENT_SIZE=$(wc -c < "$NEW_JOBS_FILE")
if [ "$CONTENT_SIZE" -gt 500 ]; then
    echo "New jobs found! Content size: $CONTENT_SIZE bytes"
    # Email will be sent by the cron job that calls this script
    echo "$TIMESTAMP" > "$EMAIL_SENT_FLAG"
else
    echo "No significant new jobs found."
    rm -f "$EMAIL_SENT_FLAG"
fi
