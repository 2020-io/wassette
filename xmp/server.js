// server.js
import Fastify from 'fastify';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import registerTools from './mcp/tools.js';
import registerResources from './mcp/resources.js';

const fastify = Fastify({ logger: true });

// Initialize MCP server
const xmpMpcServer= new McpServer({
  name: 'xmp',
  version: '0.1.0',
});

// Register MCP tools + resources
registerTools(xmpMpcServer);
registerResources(xmpMpcServer);

// Mount MCP endpoint on Fastify
fastify.post('/mcp', async (req, reply) => {
  const transport = new StreamableHTTPServerTransport({
    request: req.raw,
    response: reply.raw,
  });
  await xmpMpcServer.connect(transport);
});

// Example non-MCP Fastify route
fastify.get('/api/hello', async () => {
  return { message: 'Hello from Fastify!' };
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
