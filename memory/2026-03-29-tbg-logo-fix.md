# 2026-03-29: The Bodyweight Gym Logo Fix

## Problem
Logo not rendering on https://thebodyweightgym.org — returning HTTP 500 error

## Root Cause
The server.js was enforcing HTTPS redirect for all non-localhost requests. When Cloudflare tunnel connected via HTTP to the Docker container (`tbg-app:3004`), the server redirected to HTTPS, which caused an infinite loop and 500 error.

Cloudflare tunnel wasn't setting the `X-Forwarded-Proto: https` header, so the HTTPS enforcement logic was triggering even though the external connection was HTTPS.

## Solution
Modified server.js line ~59 to also skip HTTPS enforcement for Docker internal network IPs:

```javascript
const isDockerInternal = host.startsWith('172.') || host.startsWith('10.') || host === 'tbg-app';

if (isLocalhost || isDockerInternal) {
  return next();
}
```

## Files Changed
- `/home/mat/dev/TheBodyweightGymOnline2025/server.js`

## Deployment
1. Updated server.js in source repo
2. Copied into running container: `docker cp server.js tbg-app:/app/server.js`
3. Restarted container: `docker restart tbg-app`

## Status
✓ Logo now loads correctly (HTTP 200)
✓ Site fully functional at https://thebodyweightgym.org

## Committed to Git
✓ Committed to main branch (f1f9269)
✓ Pushed to GitHub: Mathew-Harvey/TheBodyweightGymOnline2025
✓ Running container updated
✓ Next rebuild will include this fix automatically

## Improvements Made
- Extended to cover all RFC 1918 private IP ranges (10.x, 172.16-31.x, 192.168.x)
- Added IPv6 localhost (::1)
- Added link-local range (169.254.x)
- Added full 127.x loopback range
- Better comments explaining the logic
