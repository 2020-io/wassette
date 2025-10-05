#!/bin/bash

# Generate Self-Signed SSL Certificate
# For development/testing on local network

set -e

CERTS_DIR="/home/user/prototype/backend/certs"
SERVER_IP="192.168.100.10"
DAYS_VALID=365

echo "=========================================="
echo "  SSL Certificate Generator"
echo "=========================================="
echo ""

# Create certs directory
mkdir -p "$CERTS_DIR"

echo "[INFO] Generating self-signed SSL certificate..."
echo "[INFO] Server IP: $SERVER_IP"
echo "[INFO] Valid for: $DAYS_VALID days"
echo ""

# Create OpenSSL configuration
cat > "$CERTS_DIR/openssl.cnf" << EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
x509_extensions = v3_req

[dn]
C=US
ST=State
L=City
O=MCP Platform
OU=Development
CN=$SERVER_IP

[v3_req]
subjectAltName = @alt_names

[alt_names]
IP.1 = $SERVER_IP
IP.2 = 127.0.0.1
DNS.1 = localhost
DNS.2 = mcp-server.local
EOF

# Generate private key and certificate
openssl req \
    -x509 \
    -nodes \
    -days $DAYS_VALID \
    -newkey rsa:2048 \
    -keyout "$CERTS_DIR/server.key" \
    -out "$CERTS_DIR/server.crt" \
    -config "$CERTS_DIR/openssl.cnf" \
    -extensions v3_req

# Set proper permissions
chmod 600 "$CERTS_DIR/server.key"
chmod 644 "$CERTS_DIR/server.crt"

echo ""
echo "[SUCCESS] SSL certificate generated!"
echo ""
echo "Files created:"
echo "  Private key: $CERTS_DIR/server.key"
echo "  Certificate: $CERTS_DIR/server.crt"
echo "  Config:      $CERTS_DIR/openssl.cnf"
echo ""
echo "Certificate details:"
openssl x509 -in "$CERTS_DIR/server.crt" -noout -subject -dates
echo ""
echo "=========================================="
echo "  IMPORTANT: Browser Setup Required"
echo "=========================================="
echo ""
echo "To use this certificate, you need to:"
echo ""
echo "1. Trust the certificate on your laptop:"
echo "   - Copy server.crt to your laptop"
echo "   - Import into Chrome: Settings > Security > Manage certificates"
echo "   - Or add to system trust store"
echo ""
echo "2. Alternatively, in Chrome:"
echo "   - Navigate to https://192.168.100.10"
echo "   - Click 'Advanced' on certificate warning"
echo "   - Click 'Proceed to 192.168.100.10 (unsafe)'"
echo ""
echo "Note: Self-signed certificates will show warnings."
echo "This is normal for development."
echo ""
