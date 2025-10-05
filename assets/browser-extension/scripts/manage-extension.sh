#!/bin/bash

# Extension Management Script
# Helps manage Chrome extension during Q/A testing

set -e

EXTENSION_DIR="/home/user/prototype/extension"
CHROME_PROFILE_DIR="/tmp/chrome-mcp-test"
CHROME_PID_FILE="/tmp/chrome-mcp-test.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  MCP Extension Manager${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_status() {
    echo -e "${GREEN}[STATUS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if Chrome is running
is_chrome_running() {
    if [ -f "$CHROME_PID_FILE" ]; then
        PID=$(cat "$CHROME_PID_FILE")
        if ps -p "$PID" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$CHROME_PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Start Chrome with extension
start_extension() {
    print_header
    print_status "Starting Chrome with MCP Extension..."

    if is_chrome_running; then
        print_warning "Chrome is already running with the extension"
        print_info "PID: $(cat $CHROME_PID_FILE)"
        print_info "Use './manage-extension.sh stop' first to restart"
        return 1
    fi

    # Verify extension directory exists
    if [ ! -d "$EXTENSION_DIR" ]; then
        print_error "Extension directory not found: $EXTENSION_DIR"
        exit 1
    fi

    # Verify manifest exists
    if [ ! -f "$EXTENSION_DIR/manifest.json" ]; then
        print_error "manifest.json not found in extension directory"
        exit 1
    fi

    # Create profile directory
    mkdir -p "$CHROME_PROFILE_DIR"

    print_info "Extension directory: $EXTENSION_DIR"
    print_info "Chrome profile: $CHROME_PROFILE_DIR"

    # Try different Chrome/Chromium binaries
    CHROME_BIN=""
    for bin in google-chrome chromium-browser chromium chrome; do
        if command -v "$bin" &> /dev/null; then
            CHROME_BIN="$bin"
            break
        fi
    done

    if [ -z "$CHROME_BIN" ]; then
        print_error "Chrome/Chromium not found in PATH"
        print_info "Please install Chrome or Chromium"
        exit 1
    fi

    print_info "Using browser: $CHROME_BIN"

    # Start Chrome in background
    nohup "$CHROME_BIN" \
        --user-data-dir="$CHROME_PROFILE_DIR" \
        --disable-extensions-except="$EXTENSION_DIR" \
        --load-extension="$EXTENSION_DIR" \
        --no-first-run \
        --no-default-browser-check \
        "chrome://extensions/" \
        > /tmp/chrome-mcp.log 2>&1 &

    CHROME_PID=$!
    echo $CHROME_PID > "$CHROME_PID_FILE"

    sleep 2

    if ps -p "$CHROME_PID" > /dev/null 2>&1; then
        print_status "Chrome started successfully!"
        print_info "PID: $CHROME_PID"
        print_info "Log: /tmp/chrome-mcp.log"
        echo ""
        print_info "Extension should be loaded at chrome://extensions/"
        print_info "Use './manage-extension.sh stop' to stop Chrome"
        print_info "Use './manage-extension.sh reload' to reload extension"
    else
        print_error "Chrome failed to start"
        print_info "Check log: /tmp/chrome-mcp.log"
        rm -f "$CHROME_PID_FILE"
        exit 1
    fi
}

# Stop Chrome
stop_extension() {
    print_header
    print_status "Stopping Chrome..."

    if ! is_chrome_running; then
        print_warning "Chrome is not running"
        return 0
    fi

    PID=$(cat "$CHROME_PID_FILE")
    print_info "Killing Chrome process: $PID"

    kill "$PID" 2>/dev/null || true
    sleep 1

    # Force kill if still running
    if ps -p "$PID" > /dev/null 2>&1; then
        print_warning "Chrome didn't stop gracefully, force killing..."
        kill -9 "$PID" 2>/dev/null || true
    fi

    rm -f "$CHROME_PID_FILE"
    print_status "Chrome stopped"
}

# Reload extension without restarting Chrome
reload_extension() {
    print_header
    print_status "Reloading extension..."

    if ! is_chrome_running; then
        print_error "Chrome is not running"
        print_info "Use './manage-extension.sh start' first"
        return 1
    fi

    print_info "Extension ID needed for reload"
    print_warning "Automatic reload not implemented yet"
    print_info "Manual steps:"
    print_info "  1. Go to chrome://extensions/"
    print_info "  2. Find 'MCP Extension Platform'"
    print_info "  3. Click the reload button"
    echo ""
    print_info "Or stop and start again:"
    print_info "  ./manage-extension.sh restart"
}

# Restart Chrome
restart_extension() {
    print_header
    print_status "Restarting Chrome with extension..."
    stop_extension
    sleep 1
    start_extension
}

# Show status
show_status() {
    print_header

    if is_chrome_running; then
        PID=$(cat "$CHROME_PID_FILE")
        print_status "Chrome is running"
        print_info "PID: $PID"
        print_info "Profile: $CHROME_PROFILE_DIR"
        print_info "Extension: $EXTENSION_DIR"
        echo ""
        print_info "Recent log entries:"
        tail -5 /tmp/chrome-mcp.log 2>/dev/null || echo "  (no log entries)"
    else
        print_warning "Chrome is not running"
        print_info "Use './manage-extension.sh start' to start"
    fi
}

# View logs
view_logs() {
    print_header
    print_status "Extension logs..."
    echo ""

    if [ -f /tmp/chrome-mcp.log ]; then
        tail -50 /tmp/chrome-mcp.log
    else
        print_warning "No log file found"
    fi
}

# Clean up
cleanup() {
    print_header
    print_status "Cleaning up..."

    stop_extension

    print_info "Removing Chrome profile: $CHROME_PROFILE_DIR"
    rm -rf "$CHROME_PROFILE_DIR"

    print_info "Removing log file"
    rm -f /tmp/chrome-mcp.log

    print_status "Cleanup complete"
}

# Show help
show_help() {
    print_header
    echo "Usage: $0 {start|stop|restart|reload|status|logs|cleanup|help}"
    echo ""
    echo "Commands:"
    echo "  start    - Start Chrome with extension loaded"
    echo "  stop     - Stop Chrome"
    echo "  restart  - Stop and start Chrome"
    echo "  reload   - Reload extension (Chrome must be running)"
    echo "  status   - Show current status"
    echo "  logs     - View recent Chrome logs"
    echo "  cleanup  - Stop Chrome and remove profile/logs"
    echo "  help     - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 status"
    echo "  $0 logs"
    echo "  $0 restart"
    echo ""
}

# Main command handler
case "${1:-help}" in
    start)
        start_extension
        ;;
    stop)
        stop_extension
        ;;
    restart)
        restart_extension
        ;;
    reload)
        reload_extension
        ;;
    status)
        show_status
        ;;
    logs)
        view_logs
        ;;
    cleanup)
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
