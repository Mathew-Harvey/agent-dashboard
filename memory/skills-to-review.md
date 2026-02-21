# Skills to Review - Pending Approval

## For Mat's Review

These skills were identified during community exploration on 2026-02-21. Do NOT install automatically - awaiting approval.

---

### Priority: High

#### 1. skill-vetter / skill-vetting
- **Purpose:** Security-first skill vetting for AI agents
- **Category:** Security
- **Repo:** openclaw/skills
- **Why:** Essential for safely evaluating new skills before installation

#### 2. git-sync
- **Purpose:** Automatically sync local workspace to remote GitHub
- **Category:** Git & GitHub
- **Repo:** openclaw/skills (autogame-17/git-sync)
- **Why:** Useful for automatic backups of workspace

---

### Priority: Medium

#### 3. docker-sandbox
- **Purpose:** Create and manage Docker sandboxed VM environments
- **Category:** DevOps
- **Repo:** openclaw/skills
- **Why:** Safe experimentation without affecting host

#### 4. coding-agent
- **Purpose:** Unified skill for Codex CLI, Claude Code, OpenCode, Pi Coding
- **Category:** Coding Agents
- **Repo:** openclaw/skills
- **Why:** Single skill to manage multiple coding agents

#### 5. daily-brief (from runbook)
- **Purpose:** Morning automation with weather, calendar, tasks
- **Category:** Productivity
- **Source:** digitalknk/openclaw-runbook/showcases
- **Why:** Ready-to-use automation pattern

#### 6. heartbeat-example (from runbook)
- **Purpose:** Rotating heartbeat pattern for monitoring
- **Category:** Automation
- **Source:** digitalknk/openclaw-runbook/examples
- **Why:** Improves heartbeat efficiency

---

### Priority: Low (Nice to have)

- **test-runner** - Write and run tests across languages
- **pr-reviewer** - Automated PR code review
- **exa-web-search-free** - Free AI search

---

## How to Install

Once approved, install via:
```bash
npx clawhub@latest install <skill-slug>
```

Or manually copy to `~/.openclaw/skills/`

---

## Last Updated

2026-02-21
