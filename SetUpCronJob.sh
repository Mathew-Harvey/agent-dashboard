#!/bin/bash
# ============================================================
# OpenClaw Cron Job Setup — Bosun's Fleet (24hr operation)
# ============================================================
# DAYTIME (7am-10pm):  Heartbeat active, email checks, research
# OVERNIGHT (10pm-5am): Silent research, exploring, socialising
# WAKE-UP (7am):        Compiled briefing delivered to Telegram
# ============================================================
# All times use Australia/Perth timezone
# All jobs use ISOLATED sessions (no main session pollution)
# ============================================================

set -e

TZ="Australia/Perth"
CHANNEL="telegram"

echo "============================================"
echo "  Step 1: Delete ALL existing cron jobs"
echo "============================================"
echo ""

# Get all job IDs and delete them
JOB_IDS=$(openclaw cron list --json 2>/dev/null | grep -o '"jobId":"[^"]*"' | cut -d'"' -f4)
if [ -n "$JOB_IDS" ]; then
  for JID in $JOB_IDS; do
    echo "Deleting job: $JID"
    openclaw cron delete "$JID" || true
  done
else
  echo "No existing jobs found (or could not parse list)."
fi

echo ""
echo "============================================"
echo "  Step 2: Create new cron jobs"
echo "============================================"
echo ""

# ═══════════════════════════════════════════════════════════════
# WAKE-UP BRIEFING — 7:00 AM AWST Daily
# ═══════════════════════════════════════════════════════════════
echo ">>> Creating: Wake-Up Briefing (7am)..."
openclaw cron add \
  --name "wakeup-briefing" \
  --cron "0 7 * * *" \
  --tz "$TZ" \
  --session isolated \
  --message "Good morning Mat. Compile the OVERNIGHT BRIEFING. Read ALL files from the last 12 hours in memory/research/, memory/daily-logs/, memory/overnight/, and memory/community/. Deliver a structured report: (1) OVERNIGHT RESEARCH — what topics were explored, key findings, links to anything good. (2) COMMUNITY — interesting Moltbook posts, ClawHub discoveries, forum conversations. (3) OPPORTUNITIES — any new entries or updates in memory/opportunities.md. (4) EMAILS — anything that came in overnight to either inbox. (5) MAC MINI FUND PROGRESS — current best path to 20K AUD based on accumulated research. (6) TODAYS AGENDA — what the agents plan to work on today. Be specific and cite actual findings. Keep it concise but thorough — this is Mats morning newspaper." \
  --announce \
  --channel "$CHANNEL"

echo ""

# ═══════════════════════════════════════════════════════════════
# EMAIL CHECK — Every 2 hours, 8am-8pm AWST
# ═══════════════════════════════════════════════════════════════
echo ">>> Creating: Email Check (daytime every 2hrs)..."
openclaw cron add \
  --name "email-check" \
  --cron "0 8,10,12,14,16,18,20 * * *" \
  --tz "$TZ" \
  --session isolated \
  --message "Check both email inboxes: (1) jeff-assistant@agentmail.to and (2) mathewharvey@gmail.com. ONLY message Mat if something genuinely interesting, urgent, or actionable has arrived. If nothing noteworthy, save a one-line log to memory/email-log.md and respond with NO_REPLY. Do NOT send Mat a message just to say nothing is new." \
  --announce \
  --channel "$CHANNEL"

echo ""

# ═══════════════════════════════════════════════════════════════
# DAYTIME RESEARCH — 10:00 AM AWST Daily
# ═══════════════════════════════════════════════════════════════
echo ">>> Creating: Daytime Research (10am)..."
openclaw cron add \
  --name "research-daytime" \
  --cron "0 10 * * *" \
  --tz "$TZ" \
  --session isolated \
  --message "DAYTIME RESEARCH SESSION. Your mission: explore the internet and learn something valuable toward earning 20K AUD for a Mac Mini cluster. Today focus on ONE of these rotating topics (pick based on day of week): Mon=AI SaaS product ideas and market gaps, Tue=API monetisation and developer tools, Wed=maritime/marine tech opportunities (Mat works in biofouling management for the Royal Australian Navy fleet), Thu=automation products people actually pay for, Fri=ClawHub skills ecosystem — what sells and what gaps exist, Sat=competitor analysis of AI agent products and services, Sun=review the weeks research and identify the single best opportunity. Steps: (1) Use browser to search and read real sources — not just top results, dig deep. (2) Take structured notes in memory/research/YYYY-MM-DD-topic.md. (3) If you find something genuinely actionable, flag it in memory/opportunities.md with a confidence rating 1-10. Do NOT message Mat — take notes only."

echo ""

# ═══════════════════════════════════════════════════════════════
# DAYTIME COMMUNITY — 2:00 PM AWST Daily
# ═══════════════════════════════════════════════════════════════
echo ">>> Creating: Daytime Community (2pm)..."
openclaw cron add \
  --name "community-daytime" \
  --cron "0 14 * * *" \
  --tz "$TZ" \
  --session isolated \
  --message "COMMUNITY SESSION. Go explore and socialise. (1) Browse ClawHub at https://clawhub.ai — look for new skills, trending tools, interesting configs. Note finds in memory/skills-discovered.md. (2) Check Moltbook for interesting posts, conversations, TIL entries. Engage if you have something useful to share. (3) Browse OpenClaw Discord or forums for tips and ideas. (4) Check GitHub repos: openclaw/openclaw issues, VoltAgent/awesome-openclaw-skills, digitalknk/openclaw-runbook. (5) Do NOT install skills automatically — add candidates to memory/skills-to-review.md for Mat to approve. (6) Save a summary to memory/community/YYYY-MM-DD-daytime.md. Do NOT message Mat."

echo ""

# ═══════════════════════════════════════════════════════════════
# EVENING SYNTHESIS — 8:00 PM AWST Daily
# ═══════════════════════════════════════════════════════════════
echo ">>> Creating: Evening Synthesis (8pm)..."
openclaw cron add \
  --name "evening-synthesis" \
  --cron "0 20 * * *" \
  --tz "$TZ" \
  --session isolated \
  --message "EVENING SYNTHESIS. Review everything from today: (1) Read all files created today in memory/research/ and memory/daily-logs/ and memory/community/. (2) Update memory/growth-log.md with a dated entry: what was learned, how it connects to previous knowledge, progress toward 20K. (3) Update memory/opportunities.md — promote, demote, or refine based on today. (4) If accumulated knowledge suggests a viable tool/API/product, draft a proposal in memory/product-ideas/. (5) Plan what the OVERNIGHT sessions should focus on — write priorities to memory/overnight/tonight-plan.md. (6) You may update HEARTBEAT.md or create cron jobs if it helps the mission. Log changes in memory/cron-changes.md. Do NOT message Mat."

echo ""

# ═══════════════════════════════════════════════════════════════
#  OVERNIGHT SESSIONS (10pm - 5am AWST) — ALL SILENT
# ═══════════════════════════════════════════════════════════════

echo ">>> Creating: Overnight Research (10:30pm)..."
openclaw cron add \
  --name "overnight-research" \
  --cron "30 22 * * *" \
  --tz "$TZ" \
  --session isolated \
  --message "OVERNIGHT RESEARCH SESSION. Mat is asleep — this is your time to go deep. Read memory/overnight/tonight-plan.md for focus areas if it exists, otherwise pick up from where daytime research left off. Spend this session doing DEEP exploration: (1) Follow rabbit holes — if daytime research surfaced an interesting lead, now is the time to chase it thoroughly. (2) Research HOW people are actually making money with AI agents, APIs, and automation tools in 2026. Look for real examples, not hype. (3) Explore Product Hunt, Indie Hackers, Hacker News for inspiration on small profitable products. (4) If exploring maritime/marine tech: look at gaps in compliance software, vessel management tools, environmental monitoring. (5) Save thorough notes to memory/overnight/YYYY-MM-DD-research.md. Include URLs, key quotes, specific numbers. Do NOT message Mat."

echo ""

echo ">>> Creating: Overnight Community (12:30am)..."
openclaw cron add \
  --name "overnight-community" \
  --cron "30 0 * * *" \
  --tz "$TZ" \
  --session isolated \
  --message "OVERNIGHT COMMUNITY SESSION. Time to socialise and learn from other agents. (1) Browse Moltbook — read the latest TIL posts, engage thoughtfully with other agents, share something you learned today. Be curious, be genuine. (2) Explore https://onlycrabs.ai for interesting SOUL.md configurations — note any creative agent setups that inspire new ideas. (3) Browse ClawHub trending and recently published skills. (4) Check Reddit r/openclaw or r/ClaudeAI or r/LocalLLaMA for discussions about agent autonomy, money-making strategies, and new tools. (5) If you find agents or humans doing interesting things, note their approach in memory/community/YYYY-MM-DD-overnight.md. (6) If you find a community, forum, or group that seems worth joining or monitoring regularly, add it to memory/communities-to-watch.md. Do NOT message Mat."

echo ""

echo ">>> Creating: Overnight Build Session (2:30am)..."
openclaw cron add \
  --name "overnight-build" \
  --cron "30 2 * * *" \
  --tz "$TZ" \
  --session isolated \
  --message "OVERNIGHT BUILD SESSION. Time to create, not just research. Check memory/product-ideas/ for any proposals that have reached a viable stage. If one exists: (1) Start prototyping it — write code, create a skill, build an API, draft documentation. Save work to workspace/projects/. (2) If building a ClawHub skill: follow the SKILL.md spec from https://github.com/openclaw/clawhub. (3) If building a tool/API: create a working proof of concept, not just a plan. (4) Test what you build. Document what works and what doesnt. If NO product ideas are ready yet: (1) Study successful ClawHub skills — what makes them popular? What patterns work? (2) Draft a new product idea based on accumulated research. Focus on things that can generate revenue quickly with minimal infrastructure. (3) Update memory/product-ideas/ with your draft. Save all work to memory/overnight/YYYY-MM-DD-build.md. Do NOT message Mat."

echo ""

echo ">>> Creating: Pre-Dawn Compilation (4:30am)..."
openclaw cron add \
  --name "overnight-compile" \
  --cron "30 4 * * *" \
  --tz "$TZ" \
  --session isolated \
  --message "PRE-DAWN COMPILATION. Prepare for Mats morning. (1) Read ALL overnight notes from memory/overnight/. (2) Write a compiled summary to memory/overnight/YYYY-MM-DD-summary.md that the morning briefing can reference. Structure it as: RESEARCH FINDINGS, COMMUNITY HIGHLIGHTS, BUILD PROGRESS, TOP OPPORTUNITIES, RECOMMENDED ACTIONS. (3) Update memory/growth-log.md with overnight learning. (4) Update memory/opportunities.md if overnight work changed any rankings. (5) Check both email inboxes one final time — note anything that arrived overnight in the summary. (6) Review memory/overnight/tonight-plan.md — did we accomplish what we set out to do? Note gaps. This summary is what the 7am wakeup-briefing will use to report to Mat. Make it thorough and specific. Do NOT message Mat."

echo ""

# ═══════════════════════════════════════════════════════════════
# WEEKLY STRATEGY — Sunday 7:00 PM AWST
# ═══════════════════════════════════════════════════════════════
echo ">>> Creating: Weekly Strategy Review (Sun 7pm)..."
openclaw cron add \
  --name "weekly-strategy" \
  --cron "0 19 * * 0" \
  --tz "$TZ" \
  --session isolated \
  --message "WEEKLY STRATEGY REVIEW for Mat. Read through ALL of memory/research/, memory/daily-logs/, memory/overnight/, memory/community/, memory/opportunities.md, memory/growth-log.md, and memory/product-ideas/ from this week. Deliver: (1) TOP 5 things learned this week with specifics. (2) Best opportunity identified — what it is, why it could work, estimated effort and revenue. (3) Skills discovered worth installing — with links and descriptions. (4) Communities and contacts worth engaging with. (5) Progress toward 20K Mac Mini fund — current most viable path. (6) Build progress — what was prototyped, what works, what doesnt. (7) Recommended focus for next week. (8) Any self-improvement the agents need (skills, tools, config changes, more autonomy). Be detailed. This is the weekly board meeting." \
  --announce \
  --channel "$CHANNEL"

echo ""
echo "============================================"
echo "  Step 3: Create memory directories"
echo "============================================"
mkdir -p ~/.openclaw/workspace/memory/research
mkdir -p ~/.openclaw/workspace/memory/daily-logs
mkdir -p ~/.openclaw/workspace/memory/product-ideas
mkdir -p ~/.openclaw/workspace/memory/overnight
mkdir -p ~/.openclaw/workspace/memory/community
mkdir -p ~/.openclaw/workspace/projects
echo "Done — directories created."

echo ""
echo "============================================"
echo "  Step 4: Verify"
echo "============================================"
echo "Run: openclaw cron list"
echo "Run: openclaw gateway status"
echo ""
echo "============================================"
echo "  Step 5: Restart gateway"
echo "============================================"
echo "Run: systemctl --user restart openclaw-gateway"
echo ""
echo "All done. Your agents now work 24 hours."
