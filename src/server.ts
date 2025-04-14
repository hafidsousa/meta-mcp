#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { FacebookMarketingClient } from './client';
import { CampaignConfig, AdSetConfig, AdConfig, FacebookConfig } from './types';
import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

/**
 * Custom logger that writes to stderr to avoid mixing logs with JSON responses
 * @param message Message to log
 */
function log(message: string) {
  console.error(message);
}

// Initialize Facebook client with environment variables
const fbConfig: FacebookConfig = {
  adAccountId: process.env.FB_AD_ACCOUNT_ID || '',
  accessToken: process.env.FB_ACCESS_TOKEN || '',
  appId: process.env.FB_APP_ID || '',
  appSecret: process.env.FB_APP_SECRET || ''
};

// Define all available tools
const CAMPAIGN_TOOL: Tool = {
  name: "createCampaign",
  description: "Creates a new Facebook ad campaign",
  inputSchema: {
    type: "object",
    properties: {
      config: {
        type: "object",
        description: "Campaign configuration",
        properties: {
          name: { type: "string", description: "Campaign name" },
          objective: { type: "string", description: "Campaign objective (e.g., CONVERSIONS, MESSAGES)" },
          status: { type: "string", description: "Campaign status (ACTIVE, PAUSED)" },
          specialAdCategories: { type: "array", description: "Special ad categories if applicable" }
        },
        required: ["name", "objective"]
      }
    },
    required: ["config"]
  }
};

const ADSET_TOOL: Tool = {
  name: "createAdSet",
  description: "Creates a new ad set within a campaign",
  inputSchema: {
    type: "object",
    properties: {
      config: {
        type: "object",
        description: "Ad set configuration",
        properties: {
          name: { type: "string", description: "Ad set name" },
          campaignId: { type: "string", description: "Parent campaign ID" },
          dailyBudget: { type: "number", description: "Daily budget in cents (e.g., 5000 = $50.00)" },
          targeting: { type: "object", description: "Targeting specifications" }
        },
        required: ["name", "campaignId"]
      }
    },
    required: ["config"]
  }
};

const AD_TOOL: Tool = {
  name: "createAd",
  description: "Creates a new ad within an ad set",
  inputSchema: {
    type: "object",
    properties: {
      config: {
        type: "object",
        description: "Ad configuration",
        properties: {
          name: { type: "string", description: "Ad name" },
          adsetId: { type: "string", description: "Parent ad set ID" },
          creative: { type: "object", description: "Ad creative configuration" }
        },
        required: ["name", "adsetId", "creative"]
      }
    },
    required: ["config"]
  }
};

const GET_ADSETS_TOOL: Tool = {
  name: "getAdSets",
  description: "Gets all ad sets for a campaign",
  inputSchema: {
    type: "object",
    properties: {
      campaignId: { type: "string", description: "Campaign ID" }
    },
    required: ["campaignId"]
  }
};

const GET_ADS_TOOL: Tool = {
  name: "getAds",
  description: "Gets all ads for an ad set",
  inputSchema: {
    type: "object",
    properties: {
      adSetId: { type: "string", description: "Ad set ID" }
    },
    required: ["adSetId"]
  }
};

const PAUSE_CAMPAIGN_TOOL: Tool = {
  name: "pauseCampaign",
  description: "Pauses an active campaign",
  inputSchema: {
    type: "object",
    properties: {
      campaignId: { type: "string", description: "Campaign ID" }
    },
    required: ["campaignId"]
  }
};

const PAUSE_ADSET_TOOL: Tool = {
  name: "pauseAdSet",
  description: "Pauses an active ad set",
  inputSchema: {
    type: "object",
    properties: {
      adSetId: { type: "string", description: "Ad set ID" }
    },
    required: ["adSetId"]
  }
};

const PAUSE_AD_TOOL: Tool = {
  name: "pauseAd",
  description: "Pauses an active ad",
  inputSchema: {
    type: "object",
    properties: {
      adId: { type: "string", description: "Ad ID" }
    },
    required: ["adId"]
  }
};

const GET_ACCOUNTS_TOOL: Tool = {
  name: "getAvailableAdAccounts",
  description: "Gets all available ad accounts for the user",
  inputSchema: {
    type: "object",
    properties: {}
  }
};

const GET_CAMPAIGNS_TOOL: Tool = {
  name: "getCampaigns",
  description: "Gets all campaigns for the ad account",
  inputSchema: {
    type: "object",
    properties: {}
  }
};

// Create the MCP server
const server = new Server(
  {
    name: "meta-mcp",
    version: "1.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize our Facebook client
let client: FacebookMarketingClient;

function initializeClient() {
  // Validate required environment variables
  if (!fbConfig.accessToken) {
    throw new Error('FB_ACCESS_TOKEN environment variable is required');
  }

  if (!fbConfig.adAccountId) {
    throw new Error('FB_AD_ACCOUNT_ID environment variable is required');
  }

  log('Initializing Facebook Marketing Client...');
  log(`Using Ad Account ID: ${fbConfig.adAccountId}`);
  
  client = new FacebookMarketingClient(fbConfig);
}

// Handler for listing available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    CAMPAIGN_TOOL,
    ADSET_TOOL,
    AD_TOOL,
    GET_ADSETS_TOOL,
    GET_ADS_TOOL,
    PAUSE_CAMPAIGN_TOOL,
    PAUSE_ADSET_TOOL,
    PAUSE_AD_TOOL,
    GET_ACCOUNTS_TOOL,
    GET_CAMPAIGNS_TOOL,
  ],
}));

// Handler for executing tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args = {} } = request.params;
    
    if (!client) {
      initializeClient();
    }
    
    log(`Executing tool: ${name}`);
    
    let result;
    
    switch (name) {
      case "createCampaign":
        if (!args.config) {
          throw new Error("Missing required parameter: config");
        }
        result = await client.createCampaign(args.config as CampaignConfig);
        break;
      
      case "createAdSet":
        if (!args.config) {
          throw new Error("Missing required parameter: config");
        }
        result = await client.createAdSet(args.config as Partial<AdSetConfig>);
        break;
      
      case "createAd":
        if (!args.config) {
          throw new Error("Missing required parameter: config");
        }
        result = await client.createAd(args.config as AdConfig);
        break;
      
      case "getAdSets":
        if (typeof args.campaignId !== 'string') {
          throw new Error("Missing or invalid required parameter: campaignId");
        }
        result = await client.getAdSets(args.campaignId);
        break;
      
      case "getAds":
        if (typeof args.adSetId !== 'string') {
          throw new Error("Missing or invalid required parameter: adSetId");
        }
        result = await client.getAds(args.adSetId);
        break;
      
      case "pauseCampaign":
        if (typeof args.campaignId !== 'string') {
          throw new Error("Missing or invalid required parameter: campaignId");
        }
        result = await client.pauseCampaign(args.campaignId);
        break;
      
      case "pauseAdSet":
        if (typeof args.adSetId !== 'string') {
          throw new Error("Missing or invalid required parameter: adSetId");
        }
        result = await client.pauseAdSet(args.adSetId);
        break;
      
      case "pauseAd":
        if (typeof args.adId !== 'string') {
          throw new Error("Missing or invalid required parameter: adId");
        }
        result = await client.pauseAd(args.adId);
        break;
      
      case "getAvailableAdAccounts":
        result = await client.getAvailableAdAccounts();
        break;
      
      case "getCampaigns":
        result = await client.getCampaigns();
        break;
      
      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
    
    return {
      content: [
        { 
          type: "text", 
          text: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)
        }
      ],
      isError: false,
    };
    
  } catch (error) {
    log(`Error executing tool: ${error instanceof Error ? error.message : String(error)}`);
    
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

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