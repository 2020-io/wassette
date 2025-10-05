FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production && npm cache clean --force

# Copy all application files
COPY server.js ./

# Verify modules installed
RUN ls -la /app && ls -la /app/node_modules 2>/dev/null || echo "node_modules check"

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
