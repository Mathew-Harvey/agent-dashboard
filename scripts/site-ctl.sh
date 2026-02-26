#!/bin/bash
# The Bodyweight Gym - Site & Tunnel Management Script
# Usage: ./site-ctl.sh [start|stop|restart|status|tunnel]

set -e

SITE_DIR="/home/mat/dev/TheBodyweightGymOnline2025"
SITE_PORT=3000
TUNNEL_CONFIG="$HOME/.cloudflared/config.yml"
TUNNEL_LOG="/tmp/cloudflared.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check if a process is running on a port
check_port() {
    if ss -tlnp 2>/dev/null | grep -q ":$1 "; then
        return 0
    elif netstat -tlnp 2>/dev/null | grep -q ":$1 "; then
        return 0
    elif curl -s http://localhost:$1 >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Get PID of process on a port
get_port_pid() {
    ss -tlnp 2>/dev/null | grep ":$1 " | sed -n 's/.*pid=\([0-9]*\).*/\1/p' || echo ""
}

# Start the website
start_site() {
    log "Starting The Bodyweight Gym Online..."
    
    if check_port $SITE_PORT; then
        warn "Port $SITE_PORT already in use. Stopping existing process..."
        stop_site
    fi
    
    cd "$SITE_DIR"
    PORT=$SITE_PORT node server.js > /tmp/bodyweightgym.log 2>&1 &
    SITE_PID=$!
    
    sleep 2
    
    if curl -s http://localhost:$SITE_PORT >/dev/null 2>&1; then
        log "Site started successfully (PID: $SITE_PID)"
    else
        error "Site failed to start. Check /tmp/bodyweightgym.log"
        exit 1
    fi
}

# Stop the website
stop_site() {
    log "Stopping The Bodyweight Gym Online..."
    
    local pid=$(get_port_pid $SITE_PORT)
    if [ -n "$pid" ]; then
        kill $pid 2>/dev/null || true
        sleep 1
        log "Site stopped"
    else
        warn "Site not running"
    fi
}

# Start the tunnel
start_tunnel() {
    log "Starting Cloudflare tunnel..."
    
    if pgrep -f "cloudflared.*tunnel" >/dev/null; then
        warn "Tunnel already running. Restarting..."
        stop_tunnel
    fi
    
    nohup cloudflared tunnel --config "$TUNNEL_CONFIG" run > "$TUNNEL_LOG" 2>&1 &
    TUNNEL_PID=$!
    
    sleep 3
    
    if curl -s https://thebodyweightgym.org >/dev/null 2>&1; then
        log "Tunnel started successfully"
    else
        error "Tunnel may not be working. Check $TUNNEL_LOG"
    fi
}

# Stop the tunnel
stop_tunnel() {
    log "Stopping Cloudflare tunnel..."
    pkill -f "cloudflared.*tunnel" 2>/dev/null || true
    sleep 1
    log "Tunnel stopped"
}

# Check status
status() {
    echo "=== The Bodyweight Gym Status ==="
    echo ""
    
    # Site status
    echo "Website:"
    if check_port $SITE_PORT; then
        local pid=$(get_port_pid $SITE_PORT)
        echo -e "  ${GREEN}Running${NC} (PID: $pid)"
        curl -sI http://localhost:$SITE_PORT | head -1
    else
        echo -e "  ${RED}Not running${NC}"
    fi
    echo ""
    
    # Tunnel status
    echo "Cloudflare Tunnel:"
    if pgrep -f "cloudflared.*tunnel" >/dev/null; then
        echo -e "  ${GREEN}Running${NC}"
        if curl -sI https://thebodyweightgym.org | head -1 | grep -q "200"; then
            echo -e "  ${GREEN}Site accessible${NC} (https://thebodyweightgym.org)"
        else
            echo -e "  ${RED}Site NOT accessible${NC}"
        fi
    else
        echo -e "  ${RED}Not running${NC}"
    fi
    echo ""
    
    # Landing pages
    echo "Landing Pages:"
    for url in "muscleup-landing.onrender.com" "handstand-landingpage.onrender.com"; do
        if curl -sI "https://$url" | head -1 | grep -q "200"; then
            echo -e "  ${GREEN}$url${NC} - OK"
        else
            echo -e "  ${RED}$url${NC} - DOWN"
        fi
    done
}

# Restart everything
restart() {
    log "Restarting everything..."
    stop_tunnel
    stop_site
    sleep 2
    start_site
    sleep 2
    start_tunnel
    status
}

# Tail tunnel logs
tunnel_logs() {
    tail -f "$TUNNEL_LOG"
}

# Main case statement
case "$1" in
    start)
        start_site
        start_tunnel
        ;;
    stop)
        stop_site
        stop_tunnel
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    site)
        case "$2" in
            start) start_site ;;
            stop) stop_site ;;
            restart) stop_site; start_site ;;
            *) echo "Usage: $0 site {start|stop|restart}" ;;
        esac
        ;;
    tunnel)
        case "$2" in
            start) start_tunnel ;;
            stop) stop_tunnel ;;
            restart) stop_tunnel; start_tunnel ;;
            logs) tunnel_logs ;;
            *) echo "Usage: $0 tunnel {start|stop|restart|logs}" ;;
        esac
        ;;
    *)
        echo "The Bodyweight Gym - Site & Tunnel Controller"
        echo ""
        echo "Usage: $0 {start|stop|restart|status|site|tunnel} [options]"
        echo ""
        echo "Commands:"
        echo "  start           Start site and tunnel"
        echo "  stop            Stop site and tunnel"
        echo "  restart         Restart everything"
        echo "  status          Show status of all services"
        echo ""
        echo "  site start      Start website only"
        echo "  site stop       Stop website only"
        echo "  site restart    Restart website only"
        echo ""
        echo "  tunnel start    Start tunnel only"
        echo "  tunnel stop     Stop tunnel only"
        echo "  tunnel restart  Restart tunnel only"
        echo "  tunnel logs     Watch tunnel logs"
        echo ""
        echo "Examples:"
        echo "  $0 start           # Start everything"
        echo "  $0 status          # Check what's running"
        echo "  $0 tunnel logs     # Watch tunnel logs"
        exit 1
        ;;
esac
