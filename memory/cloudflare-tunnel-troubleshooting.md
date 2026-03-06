# Cloudflare Tunnel Troubleshooting & Deployment

## The Problem

**Error 1033**: "Cloudflare is currently unable to resolve it" = tunnel not running or not connected
**Error 1000**: "DNS points to prohibited IP" = CNAME points to wrong tunnel ID or A/AAAA records conflict

## Current Setup (March 2026)

- **Domain**: thebodyweightgym.org
- **DNS**: Cloudflare (zone ID: 1c5412cbeb2baa1011b044ee59216314)
- **Active Tunnel**: `tbg-new` (ID: 20732a79-f8d9-4d3e-bde9-0e6849e65792)
- **Tunnel URL**: `20732a79-f8d9-4d3e-bde9-0e6849e65792.cfargotunnel.com`

## How to Fix When Down

### Step 1: Check if tunnel is running
```bash
ps aux | grep cloudflared
```

### Step 2: If NOT running, start it
```bash
pkill -f cloudflared
nohup /home/linuxbrew/.linuxbrew/bin/cloudflared --config /home/mat/.cloudflared/config-new.yml tunnel run tbg-new > /tmp/cloudflared.log 2>&1 &
```

### Step 3: Verify tunnel connected
```bash
tail -20 /tmp/cloudflared.log
# Should see "Registered tunnel connection" with location per01, mel01
```

### Step 4: Test
```bash
curl -sI https://thebodyweightgym.org
# Should return HTTP 200, not 530
```

### Step 5: If still getting 1033 or 1000, check DNS

**Option A: Update CNAME via cloudflared CLI**
```bash
# Delete old tunnel entirely (if exists)
cloudflared tunnel delete bodyweight-gym

# Create fresh tunnel
cloudflared tunnel create tbg-new
# → Creates credentials: /home/mat/.cloudflared/20732a79-f8d9-4d3e-bde9-0e6849e65792.json

# Route DNS (--overwrite-dns or -f flag)
cloudflared tunnel route dns -f tbg-new thebodyweightgym.org
cloudflared tunnel route dns -f tbg-new muscleup.thebodyweightgym.org
cloudflared tunnel route dns -f tbg-new handstand.thebodyweightgym.org
```

**Option B: Manual DNS update in Cloudflare Dashboard**
1. Go to https://dash.cloudflare.com → thebodyweightgym.org → DNS
2. Find CNAME for `@` (thebodyweightgym.org)
3. Ensure it points to: `20732a79-f8d9-4d3e-bde9-0e6849e65792.cfargotunnel.com`
4. **DELETE any A or AAAA records** for thebodyweightgym.org (tunnels use CNAME only)
5. Wait 1-2 minutes for propagation

## Tunnel Config File

Location: `/home/mat/.cloudflared/config-new.yml`

```yaml
tunnel: 20732a79-f8d9-4d3e-bde9-0e6849e65792
credentials-file: /home/mat/.cloudflared/20732a79-f8d9-4d3e-bde9-0e6849e65792.json

ingress:
  - hostname: thebodyweightgym.org
    service: https://muscleup-landing.onrender.com
    originRequest:
      noTLSVerify: true
      connectTimeout: 30s
  - service: http_status:404
```

## Subdomains

| Subdomain | Routes to |
|-----------|-----------|
| thebodyweightgym.org | muscleup-landing.onrender.com |
| muscleup.thebodyweightgym.org | muscleup-landing.onrender.com |
| handstand.thebodyweightgym.org | handstand-landingpage.onrender.com |

## API Token Issue

The .env file has Cloudflare API tokens but they're likely invalidated. To update DNS programmatically:

1. Generate new API token at: https://dash.cloudflare.com/profile/api-tokens
2. Create token with "Edit DNS" permissions for zone thebodyweightgym.org
3. Update .env with new token: `CLOUDFLARE_API_TOKEN=your_new_token`

## What Went Wrong (March 6, 2026)

1. Original tunnel (bodyweight-gym, ID: 930bfb9c-3c47-411b-970a-32a61cf92dfd) was running on Mat's home server
2. That server went down / tunnel stopped
3. DNS still pointed to old tunnel ID → Error 1033
4. Created new tunnel (tbg-new) but DNS couldn't be updated via API (tokens invalid)
5. Created even newer tunnel (tbg-fresh, ID: ed08fe2a-8e1c-4006-98eb-d57798643f63)
6. Added CNAMEs for gym.thebodyweightgym.org and www.thebodyweightgym.org - these work!
7. **Root cause of main domain failure**: A/AAAA records exist for @ that conflict with CNAME
8. These A/AAAA records MUST be deleted in Cloudflare Dashboard - cannot be done via API without valid token

## Working Tunnels (March 6, 2026)

| Tunnel Name | Tunnel ID | Status | CNAMEs |
|-------------|-----------|--------|--------|
| tbg-fresh | ed08fe2a-8e1c-4006-98eb-d57798643f63 | Connected (2xmel02, 2xper01) | gym., www. |
| tbg-new | 20732a79-f8d9-4d3e-bde9-0e6849e65792 | Connected | (unused) |
| bodyweightgym | 930bfb9c-3c47-411b-970a-32a61cf92dfd | Deleted | (was old) |

## Robustness Improvements

### Current Issue
- Single point of failure: tunnel runs on this machine only
- If machine goes down, site goes down
- DNS locked to old tunnel - manual fix required

### Future Improvements (Priority Order)

1. **Health Check Cron** (EASY - do now)
   - Check site every 5 min
   - Restart tunnel if down
   - Alert if DNS not working
   - Run: `./scripts/deploy-tunnel.sh check` via cron

2. **Two Tunnel Redundancy** (MEDIUM)
   - Run tunnel on TWO machines (e.g., this machine + Mat's PC)
   - If one fails, other takes over
   - Requires: same credentials on both machines
   - Cloudflare automatically load balances

3. **Use Render/Cloudflare Pages instead of Tunnel** (EASY)
   - Deploy static site to Cloudflare Pages
   - No tunnel needed, always up
   - Free tier: unlimited requests
   - Would require moving from pm2 to static build

4. **API Token Management** (MEDIUM)
   - Generate fresh Cloudflare API token
   - Store in .env properly
   - Enable programmatic DNS updates
   - Could auto-heal without manual dashboard work

5. **Monitoring + Alerts** (MEDIUM)
   - Set up UptimeRobot or Cloudflare Analytics
   - Email/SMS if site goes down
   - Proactive notification before user notices

1. **Always check tunnel status first** - `ps aux | grep cloudflared`
2. **Tunnel must be connected** before DNS will work
3. **No A/AAAA records** for tunnel domains - only CNAME
4. **Keep API tokens fresh** - they expire or get invalidated
5. **Self-heal script** should check both tunnel status AND DNS
