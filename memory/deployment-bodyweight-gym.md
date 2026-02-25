# The Bodyweight Gym - Deployment Guide

## Overview
- **Domain**: thebodyweightgym.org (registrar: Namecheap)
- **DNS**: Cloudflare (nameservers: kiki.ns.cloudflare.com, lochlan.ns.cloudflare.com)
- **Main Site**: Running on this machine (localhost:3004)
- **Products**: Hosted on Render (muscleup-landing.onrender.com, handstand-landingpage.onrender.com)

## Tunnel Setup (One-Time)

### 1. Named Tunnel Credentials
- **Tunnel Name**: bodyweight-gym
- **Tunnel UUID**: 930bfb9c-3c47-411b-970a-32a61cf92dfd
- **Credentials File**: `/home/mat/.cloudflared/930bfb9c-3c47-411b-970a-32a61cf92dfd.json`
- **Config File**: `~/.cloudflared/config.yml`
- **Certificate**: `~/.cloudflared/cert.pem`

### 2. Config File (~/.cloudflared/config.yml)
```yaml
tunnel: 930bfb9c-3c47-411b-970a-32a61cf92dfd
credentials-file: /home/mat/.cloudflared/930bfb9c-3c47-411b-970a-32a61cf92dfd.json

ingress:
  - hostname: thebodyweightgym.org
    service: http://localhost:3004
  - hostname: muscleup.thebodyweightgym.org
    service: https://muscleup-landing.onrender.com
    originRequest:
      noTLSVerify: true
  - hostname: handstand.thebodyweightgym.org
    service: https://handstand-landingpage.onrender.com
    originRequest:
      noTLSVerify: true
  - service: http_status:404
```

### 3. DNS Routes (One-Time)
The subdomains need to be routed to the tunnel via Cloudflare DNS:
```bash
/tmp/cloudflared tunnel route dns bodyweight-gym muscleup.thebodyweightgym.org
/tmp/cloudflared tunnel route dns bodyweight-gym handstand.thebodyweightgym.org
```

This creates CNAME records in Cloudflare DNS pointing to the tunnel.

## Starting the Site

### Option 1: Manual Start
```bash
# Start the local server (if not running)
cd /home/mat/dev/TheBodyweightGymOnline2025
node server.js &

# Start the tunnel
/tmp/cloudflared --config ~/.cloudflared/config.yml tunnel run bodyweight-gym &
```

### Option 2: Using the Script
```bash
# Create a start script for convenience
./start-bodyweight-gym.sh
```

### Verify It's Working
```bash
curl -s -o /dev/null -w "%{http_code}" https://thebodyweightgym.org
curl -s -o /dev/null -w "%{http_code}" https://muscleup.thebodyweightgym.org
curl -s -o /dev/null -w "%{http_code}" https://handstand.thebodyweightgym.org
```

## Updating the Main Site

The main site is in: `/home/mat/dev/TheBodyweightGymOnline2025/public/index.html`

After making changes:
```bash
# Changes are live immediately (server reads from disk)
# Just refresh the browser to see changes
```

## Updating Render Products

The landing pages are separate projects:
- Ring Muscle Up: https://github.com/Mathew-Harvey/petswap-landing (check repo name)
- Handstand: https://github.com/Mathew-Harvey/handstand-landingpage (check repo name)

Push to GitHub → Render auto-deploys.

## Troubleshooting

### Tunnel Won't Start
```bash
# Check if already running
ps aux | grep cloudflared

# Kill existing
pkill -f cloudflared

# Restart
/tmp/cloudflared --config ~/.cloudflared/config.yml tunnel run bodyweight-gym &
```

### Subdomain Not Working
```bash
# Verify DNS route exists
/tmp/cloudflared tunnel route dns bodyweight-gym muscleup.thebodyweightgym.org
/tmp/cloudflared tunnel route dns bodyweight-gym handstand.thebodyweightgym.org

# Wait 5-10 minutes for DNS propagation
```

### Site Returns 502
- Check local server is running: `curl http://localhost:3004`
- Restart local server if needed

### DNS Not Resolving
- Check Cloudflare DNS records in dashboard
- Ensure nameservers are correct in Namecheap

## Files Location Summary
| File | Path |
|------|------|
| Main site source | `/home/mat/dev/TheBodyweightGymOnline2025/public/` |
| Cloudflared binary | `/tmp/cloudflared` |
| Tunnel config | `~/.cloudflared/config.yml` |
| Tunnel credentials | `~/.cloudflared/930bfb9c-3c47-411b-970a-32a61cf92dfd.json` |
