#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { SERVER_CONFIG } from './config/constants.js';
import { TOOLS, TOOL_HANDLERS } from './tools/index.js';
import { isGmailTool } from './types/gmail.js';

// Validate tool configuration
async function validateTools() {
  for (const tool of TOOLS) {
    if (!isGmailTool(tool)) {
      throw new Error(`Invalid tool configuration: ${tool?.name || 'unnamed tool'}`);
    }
    
    if (!TOOL_HANDLERS[tool.name]) {
      throw new Error(`Missing handler for tool: ${tool.name}`);
    }
  }
}

// Server definition
const server = new Server(
  {
    name: SERVER_CONFIG.name,
    version: SERVER_CONFIG.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args = {} } = request.params;
    const handler = TOOL_HANDLERS[name];
    
    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }

    return await handler(args);
  } catch (error) {
    console.error('Tool call error:', error);
    return {
      content: [{
        type: "text",
        text: `Error: ${error instanceof Error ? error.message : String(error)}`
      }],
      isError: true
    };
  }
});

// Start server
async function runServer() {
  try {
    await validateTools();  // Add validation before server starts
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Gmail MCP Server running on stdio");
  } catch (error) {
    console.error("Server initialization failed:", error);
    throw error;  // Re-throw to trigger process.exit(1)
  }
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});