#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ServerOptions
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from 'dotenv';

import { EMAIL_TOOLS, registerEmailTools } from './email/index.js';
import { CALENDAR_TOOLS, registerCalendarTools } from './calendar/index.js';
import { ServiceContext } from './types/common.js';
import { AuthManager } from './lib/auth-manager.js';

// Initialize environment
dotenv.config();

// Environment validation
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'REDIRECT_URI',
  'GOOGLE_REFRESH_TOKEN'
] as const;

// Type-safe environment validation
type RequiredEnvVars = typeof requiredEnvVars[number];
const missingVars = requiredEnvVars.filter((varName): varName is RequiredEnvVars => 
  !process.env[varName]
);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Now TypeScript knows these exist
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;

// Server configuration
const serverInfo = {
  name: "gmail-mcp-server",
  version: "1.0.0"
} as const;

const serverConfig: ServerOptions = {
  capabilities: {
    experimental: {},
    logging: { level: "info" },
    tools: {
      supportsProgress: true
    }
  }
};

let authManager: AuthManager | null = null;
let context: ServiceContext | null = null;

async function initializeServer() {
  try {
    // Initialize transport first
    const transport = new StdioServerTransport();
    const server = new Server(serverInfo, serverConfig);

    // Initialize AuthManager
    authManager = new AuthManager(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      REDIRECT_URI,
      GOOGLE_REFRESH_TOKEN
    );

    // Validate auth before proceeding
    const isAuthValid = await authManager.validateAuth();
    if (!isAuthValid) {
      throw new Error('Failed to validate authentication');
    }

    // Get initial authenticated client
    const auth = await authManager.getClient();

    // Create service context
    context = {
      server,
      auth
    };

    // Register module handlers
    const handleEmailRequest = registerEmailTools(context);
    const handleCalendarRequest = registerCalendarTools(context);

    // Register available tools
    const availableTools = [
      ...Object.values(EMAIL_TOOLS),
      ...Object.values(CALENDAR_TOOLS)
    ];

    // Register request handlers
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        if (!context) throw new Error('Server context not initialized');
        
        // Ensure fresh auth client for each request
        context.auth = await authManager!.getClient();

        // Try email handler first
        const emailResponse = await handleEmailRequest({
          params: request.params,
          method: "tools/call"
        });
        
        if (emailResponse) {
          return {
            content: emailResponse.content,
            _meta: request.params._meta
          };
        }

        // Try calendar handler
        const calendarResponse = await handleCalendarRequest({
          params: request.params,
          method: "tools/call"
        });
        
        if (calendarResponse) {
          return {
            content: calendarResponse.content,
            _meta: request.params._meta
          };
        }

        throw new Error(`Unknown tool: ${request.params.name}`);
      } catch (error) {
        console.error('Tool call error:', error);
        return {
          content: [{
            type: "text",
            text: error instanceof Error ? error.message : String(error)
          }],
          isError: true,
          _meta: request.params._meta
        };
      }
    });

    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: availableTools
    }));

    // Connect transport
    await server.connect(transport);
    
    console.error('Server initialized successfully');
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
}

// Clean shutdown handlers
function cleanup() {
  if (authManager) {
    authManager.destroy();
    authManager = null;
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  cleanup();
});

// Start the server
initializeServer().catch((error) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});