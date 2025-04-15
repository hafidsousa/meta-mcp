import { Tool } from "@modelcontextprotocol/sdk/types.js";
import * as campaignTools from './campaign';
import * as adsetTools from './adset';
import * as adTools from './ad';
import * as accountTools from './account';

// Re-export all tools
export * from './campaign';
export * from './adset';
export * from './ad';
export * from './account';

// Function to get all available tools
export const getAllTools = (): Tool[] => [
  ...Object.values(campaignTools),
  ...Object.values(adsetTools),
  ...Object.values(adTools),
  ...Object.values(accountTools),
].filter((tool): tool is Tool => Boolean(tool && typeof tool === 'object')); 