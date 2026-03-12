#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TOOL_DEFINITIONS, dispatch } from "./tools/registry.js";
import { getDb, closeDb } from "./database/db.js";

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

process.on("SIGINT", () => {
  closeDb();
  process.exit(0);
});

process.on("SIGTERM", () => {
  closeDb();
  process.exit(0);
});

async function main(): Promise<void> {
  getDb();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `Started ansvar-security-program-mcp v1.0.0 (${TOOL_DEFINITIONS.length} tools)`
  );
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
