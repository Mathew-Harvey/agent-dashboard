# Cloudflared CLI Skill

## Overview

Managing Cloudflare Tunnels via the cloudflared CLI on Linux. Exposes locally-hosted services to the internet via named tunnels mapped to custom domains in Cloudflare DNS.

## Current Setup

- **Domain**: thebodyweightgym.org
- **DNS Provider**: Cloudflare (nameservers: kiki.ns.cloudflare.com, lochlan.ns.cloudflare.com)
- **Registrar**: Namecheap
- **Tunnel Name**: bodyweightgym
- **Tunnel UUID**: 930bfb9c-3c47-411b-970a-32a61cf92dfd
- **Credentials File**: /home/mat/.cloudflared/930bfb9c-3c47-411b-970a-32a61cf92dfd.json
- **Config File**: ~/.cloudflared/config.yml
- **Certificate**: ~/.cloudflared/cert.pem

## Important Concepts

- **Named Tunnel**: Persistent tunnel with UUID, tied to Cloudflare account. Unlike quick tunnels (trycloudflare.com), named tunnels integrate directly with Cloudflare-managed domains — no cross-account CNAME conflicts.
- **Ingress Rules**: Define which hostnames route to which local services. Evaluated top-to-bottom; last rule must be catch-all.
- **Credentials File**: JSON created during `cloudflared tunnel create`. Contains tunnel secret. Do not delete or share.
- **cert.pem**: Account-level certificate created during `cloudflared tunnel login`. Needed to create/delete tunnels but NOT needed to run them.

## Config File Format

Location: `~/.cloudflared/config.yml`

```yaml
tunnel: 930bfb9c-3c47-411b-970a-32a61cf92dfd
credentials-file: /home/mat/.cloudflared/930bfb9c-3c47-411b-970a-32a61cf92dfd.json

ingress:
  - hostname: thebodyweightgym.org
    service: http://localhost:3000
  - hostname: muscleup.thebodyweightgym.org
    service: http://localhost:3001
  - hostname: handstand.thebodyweightgym.org
    service: http://localhost:3002
  - service: http_status:404
```

### Ingress Rule Options

```yaml
ingress:
  - hostname: example.com
    service: http://localhost:8080
    originRequest:
      noTLSVerify: true        # Skip TLS verification to origin
      connectTimeout: 30s      # Timeout connecting to origin
      httpHostHeader: example.com  # Override Host header sent to origin
      originServerName: example.com # TLS SNI for HTTPS origins
```

## CLI Commands Reference

### Starting and Stopping

```bash
# Start the tunnel (foreground — Ctrl+C to stop)
cloudflared tunnel run bodyweightgym

# Start with a specific config file
cloudflared tunnel run --config ~/.cloudflared/config.yml bodyweightgym

# Start in background
nohup cloudflared tunnel run bodyweightgym &> /tmp/cloudflared.log &

# Stop background tunnel
pkill cloudflared

# Check if running
pgrep -fa cloudflared
```

### Tunnel Management

```bash
# List all tunnels
cloudflared tunnel list

# Show tunnel info
cloudflared tunnel info bodyweightgym

# Delete a tunnel (must be stopped first, DNS routes must be removed)
cloudflared tunnel delete bodyweightgym

# Create a new tunnel
cloudflared tunnel create <name>

# Clean up stale connections (use if tunnel shows "inactive" but won't start)
cloudflared tunnel cleanup bodyweightgym
```

### DNS Routing

```bash
# Route a hostname to the tunnel (creates CNAME in Cloudflare DNS automatically)
cloudflared tunnel route dns bodyweightgym thebodyweightgym.org
cloudflared tunnel route dns bodyweightgym muscleup.thebodyweightgym.org
cloudflared tunnel route dns bodyweightgym handstand.thebodyweightgym.org

# Force overwrite existing DNS
cloudflared tunnel route dns bodyweightgym hostname --overwrite-dns

# View current routes
cloudflared tunnel route ip show
```

Note: The `route dns` command creates a CNAME record pointing to `<UUID>.cfargotunnel.com`. Delete any conflicting A/CNAME records in Cloudflare dashboard first.

### Authentication

```bash
# Login (creates/refreshes cert.pem — opens browser for auth)
cloudflared tunnel login

# Certificate location
~/.cloudflared/cert.pem
```

### Diagnostics and Debugging

```bash
# Run with verbose logging
cloudflared tunnel --loglevel debug run bodyweightgym

# Log to file
cloudflared tunnel --logfile /tmp/cloudflared.log run bodyweightgym

# Validate config file
cloudflared tunnel ingress validate

# Test which ingress rule matches a URL
cloudflared tunnel ingress rule https://thebodyweightgym.org

# Check version
cloudflared --version

# Update cloudflared
sudo cloudflared update
```

### Quick Tunnels (Ad-Hoc / Temporary)

```bash
# Expose a local port with a random trycloudflare.com URL (no config needed)
cloudflared tunnel --url http://localhost:3000
```

**Warning:** Do NOT CNAME a Cloudflare-managed domain to a trycloudflare.com address. Cloudflare blocks cross-account CNAMEs. Always use named tunnels for custom domains.

## Running as a Systemd Service

To keep the tunnel running after reboot and auto-restart on failure:

```bash
# Install as system service
sudo cloudflared service install

# This creates: /etc/systemd/system/cloudflared.service
# It uses: /etc/cloudflared/config.yml (copies from ~/.cloudflared/config.yml)

# Manage the service
sudo systemctl start cloudflared
sudo systemctl stop cloudflared
sudo systemctl restart cloudflared
sudo systemctl status cloudflared
sudo systemctl enable cloudflared   # start on boot
sudo systemctl disable cloudflared   # don't start on boot

# View service logs
sudo journalctl -u cloudflared -f          # follow live
sudo journalctl -u cloudflared --since today
sudo journalctl -u cloudflared -n 50      # last 50 lines
```

### Manual Systemd Service (Alternative)

If `cloudflared service install` doesn't work or you want more control:

```ini
# /etc/systemd/system/cloudflared.service
[Unit]
Description=Cloudflare Tunnel for thebodyweightgym.org
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=mat
ExecStart=/usr/local/bin/cloudflared tunnel --config /home/mat/.cloudflared/config.yml run bodyweightgym
Restart=on-failure
RestartSec=5
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

## Common Issues and Fixes

### Tunnel shows connections but site returns 502

- The local service isn't running on the configured port
- Fix: Check the service is up — `curl http://localhost:3000`

### Error 522 (Connection Timed Out)

- Origin server not responding
- Often caused by a placeholder/wrong A record (e.g., 192.0.2.1)
- Fix: Remove bad A records; use tunnel routing instead

### "tunnel already has connections" on start

```bash
cloudflared tunnel cleanup bodyweightgym
```

### CNAME conflict / cross-user restriction

- Cannot CNAME from Cloudflare-managed domain to trycloudflare.com
- Fix: Use named tunnels (this setup), never quick tunnels for production

### cert.pem already exists

```bash
mv ~/.cloudflared/cert.pem ~/.cloudflared/OLD-cert.pem
cloudflared tunnel login
```

### Credentials file not found

- Ensure the credentials-file path in config.yml matches the actual JSON file
- The JSON file is created during `cloudflared tunnel create` and lives at `~/.cloudflared/<UUID>.json`

## File Locations Summary

| File | Path | Purpose |
|------|------|---------|
| Config | `~/.cloudflared/config.yml` | Tunnel config and ingress rules |
| Certificate | `~/.cloudflared/cert.pem` | Account auth (needed for create/delete) |
| Credentials | `~/.cloudflared/<UUID>.json` | Tunnel secret (needed for run) |
| Binary | `/usr/local/bin/cloudflared` | The cloudflared executable |
| Service | `/etc/systemd/system/cloudflared.service` | Systemd unit file |
| Service Config | `/etc/cloudflared/config.yml` | Config copy used by systemd service |

## Typical Workflow

```bash
# 1. Edit config to add/change services
nano ~/.cloudflared/config.yml

# 2. Add DNS route for new hostname (if needed)
cloudflared tunnel route dns bodyweightgym newhostname.thebodyweightgym.org

# 3. Restart tunnel to pick up config changes
# If running in foreground: Ctrl+C then re-run
# If running as service: sudo systemctl restart cloudflared

# 4. Verify
curl -I https://thebodyweightgym.org
```

## Quick Reference

```bash
# Start tunnel in background
nohup cloudflared tunnel --config ~/.cloudflared/config.yml run > /tmp/cloudflared.log 2>&1 &

# Check tunnel status
tail -20 /tmp/cloudflared.log

# Check if running
pgrep -fa cloudflared
```
