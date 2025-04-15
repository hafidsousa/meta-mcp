#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { SERVER_NAME, SERVER_VERSION, log } from './config';
import { initializeClient } from './handlers';
import { listToolsHandler, callToolHandler } from './handlers';

// Create the MCP server
const server = new Server(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handler for listing available tools
server.setRequestHandler(ListToolsRequestSchema, listToolsHandler);

// Handler for executing tool calls
server.setRequestHandler(CallToolRequestSchema, callToolHandler);

// Main function to start the server
async function runServer() {
  try {
    initializeClient();
    
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    log("Meta MCP Server running on stdio");
  } catch (error) {
    log(`Fatal error initializing server: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Start the server
runServer().catch((error) => {
  log(`Fatal error running server: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}); 