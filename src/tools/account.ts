import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Gets all available ad accounts for the authenticated user
 */
export const GET_ACCOUNTS_TOOL: Tool = {
  name: "getAvailableAdAccounts",
  description: "Gets all available ad accounts that the authenticated user has access to. This is often the first call you should make to identify which ad account to work with if managing multiple accounts. Returns account IDs, names, and other account-level information.",
  inputSchema: {
    type: "object",
    properties: {}
  }
}; 