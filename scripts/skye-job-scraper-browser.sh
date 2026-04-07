#!/bin/bash

# Skye Job Scraper - Browser-based scraping using OpenClaw browser tool
# Runs via OpenClaw agent to leverage browser automation

WORKSPACE="/home/mat/.openclaw/workspace"
MEMORY_DIR="$WORKSPACE/memory/skye-job-search"
RESULTS_DIR="$MEMORY_DIR/daily-results"
TODAY=$(date +%Y-%m-%d)

echo "[SKYE SCRAPER] Starting browser-based job scrape at $(date)"

# Create results directory if needed
mkdir -p "$RESULTS_DIR"

# Trigger OpenClaw agent to run the scraping
# This will be called via OpenClaw's exec with proper browser access
echo "[SKYE SCRAPER] Triggering OpenClaw agent scraping job..."

# For now, create a task file for the agent to pick up
cat > "$MEMORY_DIR/scrape-request-$TODAY.json" << EOF
{
  "date": "$TODAY",
  "status": "pending",
  "sites_to_scrape": [
    "seek.com.au",
    "indeed.com",
    "weworkremotely.com",
    "remote.co",
    "jobs.wa.gov.au",
    "apsjobs.gov.au",
    "cityofmandurah.bigredsky.com"
  ],
  "search_terms": [
    "digital project manager",
    "product owner",
    "event manager",
    "program manager"
  ],
  "filters": {
    "remote": true,
    "location": ["Western Australia", "Remote", "Work from home"],
    "min_salary": 100000
  }
}
EOF

echo "[SKYE SCRAPER] Scrape request created: $MEMORY_DIR/scrape-request-$TODAY.json"
echo "[SKYE SCRAPER] OpenClaw agent will process this during next heartbeat or manual trigger"
