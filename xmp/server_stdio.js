#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "example-stdio-server", version: "1.0.0" });

server.registerTool(
  "echo",
  {
    title: "Echo",
    description: "Echo back the provided text",
    inputSchema: { text: z.string() }
  },
  async ({ text }) => ({ content: [{ type: "text", text: `You said: ${text}` }] })
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("MCP stdio server running…");
