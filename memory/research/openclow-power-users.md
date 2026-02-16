# OpenClaw Power User Patterns

Last updated: 2026-02-17

## Research Sources
- TheSethRose/OpenClaw-Advanced-Config (GitHub)
- OpenClaw Discord community
- ClawHub skill marketplace

## Key Patterns Discovered

### 1. Hub-and-Spoke Architecture
Most productive setups use a hub-and-spoke model:
- **Orchestrator** (Jeff in our case) - Handles memory, context, user interaction
- **Sub-agents** - Specialized roles, spawned as needed, isolated workspaces

Example from TheSethRose:
```
Seth (Orchestrator) → spawns → Linus (Coder), Finch (Research), Otto (Cron)
```

Our setup mirrors this:
- Jeff → Coder (coding tasks)
- Jeff → Hustler (revenue research)
- Jeff → Cron jobs (automations)

### 2. Agent Specialization
Each sub-agent has:
- Clear role definition in SOUL.md
- Limited, role-specific tools
- Own workspace with minimal config
- No memory (orchestrator passes context)

### 3. Spawn Permissions
Configured in openclaw.json per agent:
```json
{
  "id": "seth",
  "subagents": {
    "allowAgents": ["linus", "finch", "otto"]
  }
}
```

### 4. Zero-Context Delegation
Task prompts must be self-contained. Sub-agents have no memory of prior context.
- Include all necessary context in the spawn message
- Be explicit about output format expected
- Include any relevant files/links

### 5. Docker Sandboxing
Sub-agents run in Docker for isolation:
- Limits blast radius of errors
- Prevents accidental file access
- Enables consistent environments

### 6. Cron Job Patterns
Common automation patterns:
- Morning briefing (wakeup-briefing)
- Evening synthesis
- Overnight research
- Community engagement

## What We're Doing Well
✅ Hub-and-spoke with Coder/Hustler
✅ Kanban-based task management  
✅ Cron jobs for 24/7 operations
✅ Email inbox management
✅ Git sync on heartbeats

## Potential Improvements
1. **Add Docker sandboxing** for sub-agents (currently running on host)
2. **Add LanceDB memory** for semantic search across sessions
3. **More explicit spawn permissions** in config
4. **Zero-context prompts** - ensure all spawns include full context

## References
- https://github.com/TheSethRose/OpenClaw-Advanced-Config
- OpenClaw Discord: discord.com/invite/clawd
- ClawHub: clawhub.com
