import { FacebookMarketingClient } from './client';
import { fbConfig, log } from './config';
import { CampaignConfig, AdSetConfig, AdConfig } from './types';
import { getAllTools } from './tools';

// Global client instance
let client: FacebookMarketingClient;

/**
 * Initialize the Facebook Marketing client
 * @throws Error if required environment variables are missing
 */
export function initializeClient() {
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

/**
 * Handler for listing available tools
 */
export const listToolsHandler = async () => ({
  tools: getAllTools(),
});

/**
 * Handler for executing tool calls
 */
export const callToolHandler = async (request: any) => {
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
        result = await client.getCampaigns(
          typeof args.limit === 'number' ? args.limit : undefined,
          typeof args.status === 'string' ? args.status : undefined,
          typeof args.datePreset === 'string' ? args.datePreset : undefined,
          args.timeRange ? {
            since: args.timeRange.since,
            until: args.timeRange.until
          } : undefined
        );
        break;
      
      case "getAccountAds":
        result = await client.getAccountAds(
          typeof args.limit === 'number' ? args.limit : undefined,
          typeof args.status === 'string' ? args.status : undefined
        );
        break;
      
      case "getAd":
        if (typeof args.adId !== 'string') {
          throw new Error("Missing or invalid required parameter: adId");
        }
        result = await client.getAd(args.adId);
        break;
      
      case "updateAd":
        if (!args.config) {
          throw new Error("Missing required parameter: config");
        }
        if (typeof args.adId !== 'string') {
          throw new Error("Missing or invalid required parameter: adId");
        }
        result = await client.updateAd(args.adId, args.config as AdConfig);
        break;
      
      case "getAccountAdSets":
        result = await client.getAccountAdSets(
          typeof args.limit === 'number' ? args.limit : undefined,
          typeof args.status === 'string' ? args.status : undefined
        );
        break;
      
      case "getAdSet":
        if (typeof args.adSetId !== 'string') {
          throw new Error("Missing or invalid required parameter: adSetId");
        }
        result = await client.getAdSet(args.adSetId);
        break;
      
      case "updateAdSet":
        if (!args.config) {
          throw new Error("Missing required parameter: config");
        }
        if (typeof args.adSetId !== 'string') {
          throw new Error("Missing or invalid required parameter: adSetId");
        }
        result = await client.updateAdSet(args.adSetId, args.config as AdSetConfig);
        break;
      
      case "updateCampaign":
        if (!args.config) {
          throw new Error("Missing required parameter: config");
        }
        if (typeof args.campaignId !== 'string') {
          throw new Error("Missing or invalid required parameter: campaignId");
        }
        result = await client.updateCampaign(args.campaignId, args.config as CampaignConfig);
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
}; 