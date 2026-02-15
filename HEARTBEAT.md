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

## 3. Pending Tasks Review
- Check memory/ for any tasks Mat explicitly assigned that are still incomplete.
- If a task is blocked, note WHAT is missing in memory/ and move on.
- Do NOT create new tasks for yourself unprompted.

## 4. Learning & Growth Log
- If any cron research/learning job completed since last heartbeat, check if it produced notes worth filing.
- If notes exist, file them properly in memory/research/ — do NOT message Mat about routine research.
- Only alert Mat if a research finding is directly actionable toward the $20K AUD Mac Mini goal.

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

## 6.5. Git Sync (every heartbeat)
- Run `git add -A && git commit -m "auto: $(date +%Y-%m-%d-%H%M) heartbeat sync" && git push origin master` from the workspace root.
- If nothing changed, git will say "nothing to commit" — that's fine, move on.
- If push fails, log the error to memory/git-errors.md and move on. Do NOT message Mat about git issues unless they persist for 24+ hours.

## 7. Final Step (ALWAYS LAST)
- If nothing above required messaging Mat → HEARTBEAT_OK
