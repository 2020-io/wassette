#!/bin/bash

# Backend Services Management Script

set -e

cd "$(dirname "$0")/.."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  MCP Backend Services Manager${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_status() {
    echo -e "${GREEN}[STATUS]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Start services
start_services() {
    print_header
    print_status "Starting backend services..."

    # Check if SSL cert exists
    if [ ! -f backend/certs/server.crt ]; then
        print_warning "SSL certificate not found"
        print_info "Generating SSL certificate..."
        ./scripts/generate-ssl-cert.sh
    fi

    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi

    # Use docker compose or docker-compose
    if docker compose version &> /dev/null 2>&1; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi

    print_info "Building and starting containers..."
    $COMPOSE_CMD up -d --build

    echo ""
    print_status "Services started!"
    echo ""
    print_info "Services available at:"
    print_info "  API:    https://192.168.100.10/api/agents"
    print_info "  Health: https://192.168.100.10/health"
    echo ""
    print_info "View logs: ./scripts/manage-backend.sh logs"
}

# Stop services
stop_services() {
    print_header
    print_status "Stopping backend services..."

    if docker compose version &> /dev/null 2>&1; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi

    $COMPOSE_CMD down

    print_status "Services stopped"
}

# Restart services
restart_services() {
    print_header
    print_status "Restarting backend services..."
    stop_services
    sleep 2
    start_services
}

# Show status
show_status() {
    print_header

    if docker compose version &> /dev/null 2>&1; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi

    $COMPOSE_CMD ps
}

# View logs
view_logs() {
    print_header

    if docker compose version &> /dev/null 2>&1; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi

    SERVICE="${1:-}"

    if [ -z "$SERVICE" ]; then
        $COMPOSE_CMD logs --tail=50 --follow
    else
        $COMPOSE_CMD logs --tail=50 --follow "$SERVICE"
    fi
}

# Test connection
test_connection() {
    print_header
    print_status "Testing backend connection..."
    echo ""

    print_info "Testing API server..."
    if curl -k -s https://192.168.100.10/health > /dev/null 2>&1; then
        print_status "API server is responding"
    else
        print_error "API server is not responding"
        print_info "Check if services are running: ./scripts/manage-backend.sh status"
    fi

    echo ""
    print_info "Testing agent endpoint..."
    RESPONSE=$(curl -k -s https://192.168.100.10/api/agents)
    if echo "$RESPONSE" | grep -q "success"; then
        print_status "Agent endpoint is working"
        echo ""
        echo "Response:"
        echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
    else
        print_error "Agent endpoint failed"
    fi
}

# Show help
show_help() {
    print_header
    echo "Usage: $0 {start|stop|restart|status|logs|test|help}"
    echo ""
    echo "Commands:"
    echo "  start    - Build and start backend services"
    echo "  stop     - Stop all backend services"
    echo "  restart  - Restart all services"
    echo "  status   - Show service status"
    echo "  logs     - View service logs (use logs <service> for specific service)"
    echo "  test     - Test backend connection"
    echo "  help     - Show this help message"
    echo ""
    echo "Services:"
    echo "  api      - Backend API server (port 3000)"
    echo "  nginx    - HTTPS proxy (ports 80, 443)"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs api"
    echo "  $0 test"
    echo ""
}

# Main
case "${1:-help}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        view_logs "${2:-}"
        ;;
    test)
        test_connection
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
