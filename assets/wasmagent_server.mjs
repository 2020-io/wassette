#!/usr/bin/env node

// npx @modelcontextprotocol/inspector node wasmagent_server.js
// docker run --rm --network host -p 6274:6274 -p 6277:6277 ghcr.io/modelcontextprotocol/inspector:latest
// http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=c26f1b3ce930c96af06147716b8b21e8380aee7446d14a5c51f0895cd947ffdb

import WebSocket from "ws";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.WebSocket = WebSocket;

import wasmagent_utils from "./wasmagent_utils.mjs";
import util from "util";
import http from "http";
import debug from "debug";

import { z } from "zod";
import { Client } from "@modelcontext/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontext/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontext/sdk/client/stdio.js";
import { WebSocketClientTransport } from "@modelcontext/sdk/client/websocket.js";
import { Server } from "@modelcontext/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontext/sdk/server/sse.js";
import { StdioServerTransport } from "@modelcontext/sdk/server/stdio.js";
import { ListResourcesResultSchema } from "@modelcontext/sdk/types.js";

old_path = process.env.PATH;
new_path = "${process.cwd}:${old_path}"
console.log(new_path);
process.exit(123);

const server = new McpServer({name: 'wasmagent-server', version: '1.0.0'});
const transport = new StdioServerTransport(server);
transport.listen();

