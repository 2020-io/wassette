#!/usr/bin/env node
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

const app = express();
app.use(express.json());

const server = new McpServer({ name: "example-sse-server", version: "1.0.0" });
server.registerTool(
  "echo",
  {
    title: "Echo",
    description: "Echo back the provided text",
    inputSchema: { text: z.string() }
  },
  async ({ text }) => ({ content: [{ type: "text", text: `You said: ${text}` }] })
);

// Track transports by sessionId
const transports = /** @type {Record<string, SSEServerTransport>} */ ({});

// SSE channel
app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;
  res.on("close", () => delete transports[transport.sessionId]);
  await server.connect(transport);
});

// Messages endpoint (client -> server)
app.post("/messages", async (req, res) => {
  const sessionId = /** @type {string} */ (req.query.sessionId);
  const transport = transports[sessionId];
  if (!transport) return res.status(400).send("No transport found for sessionId");
  await transport.handlePostMessage(req, res, req.body);
});

app.listen(3000, () => console.log("SSE server on http://localhost:3000"));
