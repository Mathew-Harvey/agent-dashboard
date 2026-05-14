#!/bin/bash
# Log daily Choreboard.io metrics from admin dashboard
# Manually record metrics until API endpoints are available

DATE=$(date +%Y-%m-%d)
LOG_FILE="/home/mat/.openclaw/workspace/memory/choreboard/daily-metrics.md"

echo "## $DATE Metrics" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "**Total Signups:** (manual check of admin dashboard)" >> "$LOG_FILE"
echo "**Workspaces:** (manual check)" >> "$LOG_FILE"
echo "**Chores Completed:** (manual check)" >> "$LOG_FILE"
echo "**Open Sessions:** (manual check)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "**Notes:**" >> "$LOG_FILE"
echo "- Check https://app.choreboard.io/admin/dash" >> "$LOG_FILE"
echo "- Correlate with X post from memory/choreboard/x-posts.md" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

echo "✅ Metrics template logged to $LOG_FILE"
echo "Visit https://app.choreboard.io/admin/dash to fill in the numbers"
