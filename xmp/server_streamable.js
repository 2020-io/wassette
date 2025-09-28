#!/usr/bin/env node
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
app.use(express.json());

function buildServer() {
  const server = new McpServer({ name: "example-streamable-server", version: "1.0.0" });
  server.registerTool(
    "echo",
    {
      title: "Echo",
      description: "Echo back the provided text",
      inputSchema: { text: z.string() }
    },
    async ({ text }) => ({ content: [{ type: "text", text: `You said: ${text}` }] })
  );
  return server;
}

app.post("/mcp", async (req, res) => {
  try {
    // New server & transport per request to avoid request ID collisions in stateless mode
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("Error handling MCP request:", err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null
      });
    }
  }
});

// GET/DELETE are not used in stateless mode
app.get("/mcp", (req, res) => res.status(405).json({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed." }, id: null }));
app.delete("/mcp", (req, res) => res.status(405).json({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed." }, id: null }));

app.listen(3000, () => console.log("Streamable HTTP (stateless) on http://localhost:3000/mcp"));
