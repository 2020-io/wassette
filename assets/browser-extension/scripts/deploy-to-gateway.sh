#!/bin/bash

# Deploy MCP Backend to Gateway (192.168.100.1)

set -e

GATEWAY="192.168.100.1"
DEPLOY_DIR="/opt/mcp-platform"
PROJECT_DIR="/home/user/prototype"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Deploy to Gateway${NC}"
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

print_header

# Check SSH access
print_info "Checking SSH access to gateway..."
if ! ssh -o ConnectTimeout=5 root@$GATEWAY "echo 'Connected'" &> /dev/null; then
    print_error "Cannot connect to gateway at $GATEWAY"
    exit 1
fi
print_status "SSH access confirmed"

# Create deployment directory
print_info "Creating deployment directory on gateway..."
ssh root@$GATEWAY "mkdir -p $DEPLOY_DIR && chown root:root $DEPLOY_DIR"

# Copy project files
print_info "Copying project files to gateway..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'keys/platform-private-key.pem' \
    --exclude 'backend/certs' \
    $PROJECT_DIR/ root@$GATEWAY:$DEPLOY_DIR/

print_status "Files copied"

# Stop existing containers
print_info "Stopping existing containers..."
ssh root@$GATEWAY "cd $DEPLOY_DIR && docker-compose -f docker-compose.gateway.yml down 2>/dev/null || true"

# Start containers
print_info "Starting containers..."
ssh root@$GATEWAY "cd $DEPLOY_DIR && docker-compose -f docker-compose.gateway.yml up -d --build"

# Wait for services to start
print_info "Waiting for services to start..."
sleep 5

# Check if services are running
print_info "Checking service status..."
ssh root@$GATEWAY "cd $DEPLOY_DIR && docker-compose -f docker-compose.gateway.yml ps"

echo ""
print_status "Deployment complete!"
echo ""
print_info "Services available at:"
print_info "  https://dumpsterfire.blackhats.com"
print_info "  https://dumpsterfire.blackhats.com/api/agents"
print_info "  https://dumpsterfire.blackhats.com/health"
echo ""
print_info "View logs:"
print_info "  ssh root@$GATEWAY 'cd $DEPLOY_DIR && docker compose -f docker-compose.gateway.yml logs -f'"
echo ""
print_info "Test connection:"
print_info "  curl https://dumpsterfire.blackhats.com/health"
echo ""
