import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * @fileoverview Simplified tool definitions for Meta Marketing API
 * 
 * This is a pure pass-through implementation that creates tools directly from
 * the exports defined in the package.json mcp configuration.
 */

// Import package.json directly 
// @ts-ignore - Dynamic require allowed for package.json
const packageJson = require('../../package.json');

// Function to get all available tools
export const getAllTools = (): Tool[] => {
  const mcpConfig = packageJson.mcp || {};
  const exports = mcpConfig.exports || {};

  // Convert package.json MCP exports to tools
  return Object.entries(exports).map(([name, config]: [string, any]) => {
    return {
      name,
      description: config.description || `Meta Marketing API ${name} operation`,
      inputSchema: {
        type: "object",
        properties: config.parameters || {}
      }
    };
  });
}; 