#!/bin/bash
# Self-deploy script for The Bodyweight Gym Cloudflare Tunnel
# Usage: ./deploy-tunnel.sh [start|restart|status|check]

set -e

CLOUDFARED="/home/linuxbrew/.linuxbrew/bin/cloudflared"
CONFIG="/home/mat/.cloudflared/config-fresh.yml"
LOGFILE="/tmp/cloudflared-fresh.log"
TUNNEL_NAME="tbg-fresh-1772791244"
TUNNEL_ID="ed08fe2a-8e1c-4006-98eb-d57798643f63"
DOMAIN="thebodyweightgym.org"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_tunnel() {
    if pgrep -f "cloudflared.*$TUNNEL_NAME" > /dev/null; then
        log_info "Tunnel is running"
        
        # Verify it's actually connected
        if grep -q "Registered tunnel connection" "$LOGFILE" 2>/dev/null; then
            log_info "Tunnel is connected to Cloudflare"
            return 0
        else
            log_warn "Tunnel process running but not connected"
            return 1
        fi
    else
        log_error "Tunnel is NOT running"
        return 1
    fi
}

check_dns() {
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN --max-time 10 --connect-timeout 5 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        log_info "DNS is working (HTTP $HTTP_CODE)"
        return 0
    elif [ "$HTTP_CODE" = "530" ]; then
        log_error "DNS returns 530 - tunnel not reachable"
        return 1
    elif [ "$HTTP_CODE" = "000" ]; then
        log_error "Connection failed - check network/DNS"
        return 1
    else
        log_warn "Unexpected HTTP $HTTP_CODE"
        return 1
    fi
}

start_tunnel() {
    log_info "Starting tunnel..."
    
    # Kill any existing
    pkill -f "cloudflared.*tbg-new" 2>/dev/null || true
    sleep 1
    
    # Start fresh
    nohup $CLOUDFARED --config $CONFIG tunnel run $TUNNEL_NAME > $LOGFILE 2>&1 &
    
    # Wait for connection
    log_info "Waiting for tunnel to connect..."
    sleep 8
    
    if check_tunnel; then
        log_info "Tunnel started successfully"
    else
        log_error "Tunnel failed to start"
        tail -20 $LOGFILE
        return 1
    fi
}

restart_tunnel() {
    log_info "Restarting tunnel..."
    pkill -f "cloudflared.*tbg-new" 2>/dev/null || true
    sleep 2
    start_tunnel
}

status() {
    echo "=== Tunnel Status ==="
    check_tunnel && echo "✓ Tunnel: OK" || echo "✗ Tunnel: DOWN"
    
    echo ""
    echo "=== DNS Check ==="
    check_dns && echo "✓ DNS: OK" || echo "✗ DNS: DOWN"
    
    echo ""
    echo "=== Recent Logs ==="
    tail -10 $LOGFILE 2>/dev/null || echo "No logs found"
}

fix_dns() {
    log_warn "DNS appears stuck - attempting fix..."
    
    # Try to update DNS via cloudflared
    log_info "Rerouting DNS for $DOMAIN..."
    $CLOUDFARED tunnel route dns -f $TUNNEL_NAME $DOMAIN 2>&1 || true
    
    sleep 5
    
    if check_dns; then
        log_info "DNS fixed!"
    else
        log_error "DNS fix failed - manual intervention required"
        log_error "Go to Cloudflare Dashboard → DNS and ensure CNAME points to:"
        log_error "$TUNNEL_ID.cfargotunnel.com"
    fi
}

# Main
case "${1:-status}" in
    start)
        start_tunnel
        check_dns
        ;;
    restart)
        restart_tunnel
        check_dns
        ;;
    status)
        status
        ;;
    check)
        check_tunnel
        check_dns
        ;;
    fix)
        fix_dns
        ;;
    *)
        echo "Usage: $0 {start|restart|status|check|fix}"
        exit 1
        ;;
esac
