import express from "express";
import crypto from "crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
app.use(express.json());

const sessions = new Map();

function buildServer(sessionId) {
  const server = new McpServer({
    name: "example-snotify-server",
    version: "1.3.1",
  });

  let counter = 0;

  server.registerTool(
    "echo",
    {
      title: "Echo",
      description: "Echo back the provided text",
      inputSchema: { text: z.string() },
    },
    async ({ text }) => {
      counter++;
      return {
        content: [
          {
            type: "text",
            text: `[Session ${sessionId}, call ${counter}] You said: ${text}`,
          },
        ],
      };
    }
  );

  server.registerTool(
    "countdown",
    {
      title: "Countdown",
      description: "Counts down from the given number, sending notifications",
      inputSchema: { start: z.number().int().positive() },
    },
    // Use the metadata callback that the SDK gives you
    async ({ start }, { sendNotification, _meta }) => {
      // First, immediate notification
      if (sendNotification) {
        sendNotification("task/progress", {
          sessionId,
          remaining: start,
          note: "Countdown started",
        });
      }

      // Then, loop with pauses and send notifications *before* finishing the handler
      for (let i = start; i > 0; i--) {
        // wait
        await new Promise((r) => setTimeout(r, 1000));

        if (sendNotification) {
          sendNotification("task/progress", {
            sessionId,
            remaining: i,
          });
        }
      }

      if (sendNotification) {
        sendNotification("task/complete", {
          sessionId,
          message: "Countdown finished!",
        });
      }

      return {
        content: [
          {
            type: "text",
            text: `Started countdown from ${start}`,
          },
        ],
      };
    }
  );

  return server;
}

app.post("/mcp", async (req, res) => {
  try {
    let sessionId = req.header("Mcp-Session-Id");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      console.log(`Generated new sessionId: ${sessionId}`);
    }

    if (!sessions.has(sessionId)) {
      const transport = new StreamableHTTPServerTransport({ sessionId });
      const server = buildServer(sessionId);
      await server.connect(transport);
      sessions.set(sessionId, { server, transport });
      console.log(`Session ${sessionId} started`);
    }

    const { transport } = sessions.get(sessionId);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("Error handling request:", err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

app.delete("/mcp", async (req, res) => {
  const sessionId = req.header("Mcp-Session-Id");
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(404).json({
      jsonrpc: "2.0",
      error: { code: -32004, message: "Session not found" },
      id: null,
    });
  }

  const { server, transport } = sessions.get(sessionId);
  transport.close();
  server.close();
  sessions.delete(sessionId);
  console.log(`Session ${sessionId} closed`);
  res.json({ jsonrpc: "2.0", result: { success: true }, id: null });
});

app.listen(8080, () =>
  console.log("Stateful MCP server with notifications at http://localhost:8080/mcp")
);
