# Bosun's Heartbeat Checklist

> **RULE: Default to HEARTBEAT_OK.** Only message Mat if something genuinely needs his attention.
> **RULE: Do NOT invent topics, updates, or conversation starters.**
> **RULE: Do NOT repeat or elaborate on prior chat topics unless a pending task explicitly requires it.**
> **RULE: Check subagent status FIRST — if Coder or Hustler are mid-task, do NOT interrupt them.**

## 1. Subagent Check (ALWAYS FIRST)
- Are Coder or Hustler running active work? If yes → HEARTBEAT_OK. Do not interrupt.

## 2. Email Quick Scan
- Check jeff-assistant@agentmail.to — anything new and actionable?
- Check mathewharvey@gmail.com — anything urgent or interesting?
- If nothing noteworthy → move on silently.
- If something genuinely interesting or urgent → alert Mat with a 2-sentence summary.

## 3. Product Health Check (5 min)
Quick signal check for active projects:

**Choreboard.io (PRIMARY REVENUE - May 2026):**
- Site: https://choreboard.io
- Admin Dashboard: https://app.choreboard.io/admin/dash
- Any new signups/beta users?
- Any site issues or deployment problems?
- Site/app uptime?

**Archived Projects (marketing paused):**
- Bodyweight Gym: https://muscleup-landing.onrender.com and https://handstand-landingpage.onrender.com (live but no active promotion)
- ClawPress: Moltbook presence (check occasionally, not priority)
- PetSwap: Deployed but inactive
- AutoFlow: Deployed but inactive

**If signal detected:**
- New sale → celebrate! Log to memory/daily-sales.md
- Site issue → alert Mat immediately
- Customer inquiry → respond promptly

## 4. Pending Tasks Review
- Check memory/ for any tasks Mat explicitly assigned that are still incomplete.
- If a task is blocked, note WHAT is missing in memory/ and move on.
- Do NOT create new tasks for yourself unprompted.

## 4. Learning & Growth Log
- If any cron research/learning job completed since last heartbeat, check if it produced notes worth filing.
- If notes exist, file them properly in memory/research/ — do NOT message Mat about routine research.
- Only alert Mat if a research finding is directly actionable toward the $20K AUD Mac Mini goal.
- **Mistake Documentation**: After any issue is fixed or problem solved, immediately document what went wrong and the solution in MEMORY.md under "Mistakes & Learnings". This ensures we only make each mistake once.

## Skye's Morning Emails

When sending job emails to Skye, make them warm, fresh, and personalized:
- Vary the opening greeting - not "Good morning" every time
- Add a light, encouraging tone that makes her smile
- Mix up the job highlights - not just a list
- Include a brief encouraging note relevant to her goals
- Keep it under 3 paragraphs

## 5. Overnight Work Check (morning heartbeats only)
- If overnight research sessions have completed, verify their notes are saved properly.
- Confirm the morning briefing cron has fresh material to compile.
- Do NOT duplicate the morning briefing — let the cron job handle it.

## 6. Self-Improvement (ONLY if idle)
- Browse ClawHub (https://clawhub.ai) for new skills relevant to our mission.
- Check Moltbook for interesting community posts or collaboration opportunities.
- Update memory/skills-discovered.md if you find something worth installing.
- You may update this HEARTBEAT.md to add useful checks — but keep it SHORT.
- You may create or modify cron jobs to pursue the Mac Mini fund goal — log changes in memory/cron-changes.md.

## 6.3 Task List (simple markdown-based)
- Check memory/tasks.md for pending tasks
- **If you have in-progress tasks:** Continue work on the highest priority one. Update status in memory/tasks.md.
- **If no in-progress tasks:** Pick the highest priority pending task and begin.
- **If a task is blocked:** Note why in memory/tasks.md and pick next available.
- **Task work is your PRIMARY job.** Only do self-improvement after tasks are handled.

## 6.4 Daily Self-Improvement (once per day - rotate through)
**Choose ONE per heartbeat to avoid redundancy:**

- **Mon/Wed/Fri:** Browse ClawHub for new skills → update memory/skills-discovered.md
- **Tue/Sat:** Check Moltbook for collaboration opportunities → memory/tools-discovered.md
- **Thu/Sun:** Quick self-check (see 6.6)
- **Daily (morning):** Claim Agora AGP at https://agora.ai (prediction market for AI agents)
- **Daily:** Post one quality comment on Moltbook

## 6.X Marketing Check (Choreboard.io)
- Check memory/choreboard/x-posts.md for recent posting activity
- Choreboard.io is PRIMARY revenue focus as of May 2026
- X (Twitter) marketing: @JeffAssistant posts daily at 9am AWST
- Assets: /home/mat/.openclaw/workspace/assets/choreboard/
- Script: /home/mat/.openclaw/workspace/scripts/choreboard-x-post.sh
- Track all marketing activity in memory/choreboard/x-posts.md
- **Note:** Bodyweight Gym marketing PAUSED as of May 2026 (archived)

## 6.5. Git Sync (every heartbeat)
- From the workspace root, run:
  ```bash
  cd /home/mat/.openclaw/workspace
  git add -A
  if git diff --cached --quiet; then
    # No changes - skip commit/push silently
    true
  else
    git commit -m "auto: $(date +%Y-%m-%d-%H%M) heartbeat sync" && git push origin master
  fi
  ```
- If push fails (network error, conflict, etc.), log the error to memory/git-errors.md and move on. Do NOT message Mat about git issues unless they persist for 24+ hours.

## 6.6. Quick Self-Check (2 min, once per day)
- What assumption did I make today that might be wrong?
- What decision am I uncertain about?
- Am I repeating a pattern from `memory/failure-patterns.md`?
- Log any insight to `memory/self-assessments/` or `memory/failure-patterns.md`

## 7. Final Step (ALWAYS LAST)
- If nothing above required messaging Mat → HEARTBEAT_OK
