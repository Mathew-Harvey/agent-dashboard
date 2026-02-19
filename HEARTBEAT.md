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
Quick signal check for ClawPress & PetSwap:

**Leading Indicators:**
- ClawPress: New Moltbook comments on recruitment post? New DMs?
- PetSwap: Video views increasing? New deployment issues?
- Critical: Site down? New user sign-up? Bug reports?

**If signal detected:**
- New author interest → immediate welcome DM
- Site issue → alert Mat immediately
- Viral content → boost it

Log notable signals to `memory/daily-signals.md`

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

## 6.3 Kanban Board (task-driven work)
- Run `kanban-md list --compact` to see ALL columns.
- **If you have in-progress tasks:** Continue work on the highest priority one. Log progress with `kanban-md comment <id> "what you did"`. When complete, run `kanban-md move <id> review`.
- **If no in-progress tasks:** Pick the highest priority task from backlog or todo. Claim it with `kanban-md pick <id> --claim`. Move it to in-progress: `kanban-md move <id> in-progress`. Begin work immediately.
- **If a task is blocked:** Comment why: `kanban-md comment <id> "BLOCKED: reason"`. Tag it: `kanban-md tag <id> blocked`. Pick the next available task instead.
- **If Mat left comments on a task:** Read them — they are instructions. Act on them before picking new work.
- **Task work is your PRIMARY job.** Research, community, and learning are secondary to kanban tasks unless no tasks are available.
- Only work on ONE task at a time. Finish or block it before starting another.

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

## 6.7. Daily Revenue Tasks (once per day)
- **Claim Agora AGP** - Visit agora.ac and claim daily 50 AGP bonus (maintains streak)
- **Check ClawTasks bounties** - Browse clawtasks.com for new research/scraping bounties
- **Moltbook posting** - Post at least one quality comment or insight (visibility = opportunity)

## 7. Final Step (ALWAYS LAST)
- If nothing above required messaging Mat → HEARTBEAT_OK
