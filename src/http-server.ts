#!/usr/bin/env node

import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TOOL_DEFINITIONS, dispatch } from "./tools/registry.js";
import { getDb, closeDb } from "./database/db.js";

const PORT = parseInt(process.env.PORT ?? "3000", 10);

function createMcpServer(): Server {
  getDb();

  const server = new Server(
    { name: "ansvar-security-program-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_DEFINITIONS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const { name, arguments: args } = request.params;
      return await dispatch(name, (args as Record<string, unknown>) ?? {});
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              error: error instanceof Error ? error.message : "Unknown error",
            }),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

async function main(): Promise<void> {
  const sessions = new Map<
    string,
    { transport: StreamableHTTPServerTransport; server: Server }
  >();

  const httpServer = createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, mcp-session-id"
      );
      res.setHeader("Access-Control-Expose-Headers", "mcp-session-id");

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }

      if (url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            status: "ok",
            service: "ansvar-security-program-mcp",
            version: "1.0.0",
            tools: TOOL_DEFINITIONS.length,
          })
        );
        return;
      }

      if (url.pathname !== "/mcp") {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
        return;
      }

      const sessionId = req.headers["mcp-session-id"] as string | undefined;

      if (sessionId && sessions.has(sessionId)) {
        const session = sessions.get(sessionId)!;
        await session.transport.handleRequest(req, res);
        return;
      }

      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
      });

      const server = createMcpServer();
      await server.connect(transport);

      transport.onclose = () => {
        if (transport.sessionId) {
          sessions.delete(transport.sessionId);
        }
      };

      await transport.handleRequest(req, res);

      if (transport.sessionId) {
        sessions.set(transport.sessionId, { transport, server });
      }
    }
  );

  httpServer.listen(PORT, () => {
    console.error(
      `Security Program MCP listening on port ${PORT}`
    );
    console.error(`MCP endpoint: http://localhost:${PORT}/mcp`);
    console.error(`Health endpoint: http://localhost:${PORT}/health`);
  });

  const shutdown = () => {
    httpServer.close(() => {
      closeDb();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
