/**
 * @fileoverview Documentation generation utilities
 * These utilities generate tool documentation from TypeScript types
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import * as SharedTypes from '../types/shared';

/**
 * Generates a Tool definition for MCP from a TypeScript type
 * This ensures tool documentation stays in sync with actual types
 * 
 * @param name Tool name
 * @param description Tool description
 * @param configType Name of the configuration or entity type
 * @param additionalParams Additional parameters for the tool
 * @returns Tool definition
 */
export function generateToolFromType(
  name: string,
  description: string,
  configType: string,
  additionalParams: Record<string, any> = {}
): Tool {
  const inputSchema: any = {
    type: "object",
    properties: {
      ...additionalParams
    },
    required: []
  };
  
  // Add config parameter if it's a config type
  if (configType.includes('Config')) {
    inputSchema.properties.config = {
      type: "object",
      description: `${configType.replace('Config', '')} configuration object`
    };
    inputSchema.required.push('config');
  }
  
  // Add parameters for entity IDs
  if (name.includes('pause') || name.includes('update') || name.includes('get')) {
    if (name.includes('Campaign')) {
      inputSchema.properties.campaignId = {
        type: "string",
        description: "ID of the campaign"
      };
      inputSchema.required.push('campaignId');
    } else if (name.includes('AdSet')) {
      inputSchema.properties.adSetId = {
        type: "string",
        description: "ID of the ad set"
      };
      inputSchema.required.push('adSetId');
    } else if (name.includes('Ad') && !name.includes('AdSet')) {
      inputSchema.properties.adId = {
        type: "string",
        description: "ID of the ad"
      };
      inputSchema.required.push('adId');
    }
  }
  
  return {
    name,
    description,
    inputSchema
  };
}

/**
 * Generates a comprehensive set of tool definitions
 * @returns Array of Tool definitions
 */
export function generateAllToolDefinitions(): Tool[] {
  return [
    // Campaign tools
    generateToolFromType(
      "createCampaign",
      "Creates a new Facebook ad campaign. This is the first step in the ad creation process. A campaign defines the overall objective and budget strategy.",
      "CampaignConfig"
    ),
    
    generateToolFromType(
      "getCampaigns",
      "Gets all campaigns for the ad account. Returns an array of campaign objects with their IDs, names, status, and other details.",
      "Campaign",
      {
        limit: {
          type: "number",
          description: "Maximum number of campaigns to return (default: 25, max: 100)"
        },
        status: {
          type: "string",
          description: "Filter campaigns by status",
          enum: Object.values(SharedTypes.CampaignStatus)
        }
      }
    ),
    
    generateToolFromType(
      "getCampaign",
      "Gets details for a specific campaign by ID.",
      "Campaign"
    ),
    
    generateToolFromType(
      "pauseCampaign",
      "Pauses an active campaign, which also pauses all associated ad sets and ads.",
      "Campaign"
    ),
    
    generateToolFromType(
      "updateCampaign",
      "Updates an existing campaign with new configuration values.",
      "CampaignConfig"
    ),
    
    // Ad Set tools
    generateToolFromType(
      "createAdSet",
      "Creates a new ad set within a campaign. Ad sets define targeting, budget, scheduling, and bidding for your ads.",
      "AdSetConfig"
    ),
    
    generateToolFromType(
      "getAdSets",
      "Gets all ad sets for a specific campaign.",
      "AdSet",
      {
        campaignId: {
          type: "string",
          description: "ID of the campaign"
        }
      }
    ),
    
    generateToolFromType(
      "getAdSet",
      "Gets details for a specific ad set by ID.",
      "AdSet"
    ),
    
    generateToolFromType(
      "getAccountAdSets",
      "Gets all ad sets for the configured ad account.",
      "AdSet",
      {
        limit: {
          type: "number",
          description: "Maximum number of ad sets to return"
        },
        status: {
          type: "string",
          description: "Filter ad sets by status",
          enum: Object.values(SharedTypes.CampaignStatus)
        }
      }
    ),
    
    generateToolFromType(
      "pauseAdSet",
      "Pauses an active ad set and all its ads.",
      "AdSet"
    ),
    
    generateToolFromType(
      "updateAdSet",
      "Updates an existing ad set with new configuration values.",
      "AdSetConfig"
    ),
    
    // Ad tools
    generateToolFromType(
      "createAd",
      "Creates a new ad within an ad set. Ads are the actual content shown to users.",
      "AdConfig"
    ),
    
    generateToolFromType(
      "getAds",
      "Gets all ads for a specific ad set.",
      "Ad",
      {
        adSetId: {
          type: "string",
          description: "ID of the ad set"
        }
      }
    ),
    
    generateToolFromType(
      "getAd",
      "Gets details for a specific ad by ID.",
      "Ad"
    ),
    
    generateToolFromType(
      "getAccountAds",
      "Gets all ads for the configured ad account.",
      "Ad",
      {
        limit: {
          type: "number",
          description: "Maximum number of ads to return"
        },
        status: {
          type: "string",
          description: "Filter ads by status",
          enum: Object.values(SharedTypes.CampaignStatus)
        }
      }
    ),
    
    generateToolFromType(
      "pauseAd",
      "Pauses an active ad.",
      "Ad"
    ),
    
    generateToolFromType(
      "updateAd",
      "Updates an existing ad with new configuration values.",
      "AdConfig"
    ),
    
    // Account tools
    generateToolFromType(
      "getAvailableAdAccounts",
      "Gets all available ad accounts for the current user or page.",
      "FacebookConfig",
      {}
    )
  ];
} 