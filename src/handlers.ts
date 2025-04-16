/**
 * @fileoverview Express handlers for the Facebook Marketing API endpoints
 * 
 * @note IMPORTANT: This is a pure pass-through proxy. All requests and responses
 * are passed directly to and from the Facebook API without modification.
 * All request payloads must use Facebook API's required formats (snake_case).
 * The Facebook API documentation should be referenced for all parameters:
 * https://developers.facebook.com/docs/marketing-apis/
 */

import { Request, Response } from 'express';
import { FacebookMarketingClient } from './client';
import { fbConfig, log } from './config';
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
        result = await client.createCampaign(args.config as any);
        break;
      
      case "createAdSet":
        result = await client.createAdSet(args.config as any);
        break;
      
      case "createAd":
        result = await client.createAd(args.config as any);
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
        if (typeof args.adId !== 'string') {
          throw new Error("Missing or invalid required parameter: adId");
        }
        result = await client.updateAd(args.adId, args.config);
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
        if (typeof args.adSetId !== 'string') {
          throw new Error("Missing or invalid required parameter: adSetId");
        }
        result = await client.updateAdSet(args.adSetId, args.config);
        break;
      
      case "updateCampaign":
        if (typeof args.campaignId !== 'string') {
          throw new Error("Missing or invalid required parameter: campaignId");
        }
        result = await client.updateCampaign(args.campaignId, args.config);
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
    
    // Pass Facebook API errors directly to the client
    return {
      content: [
        { 
          type: "text", 
          text: error instanceof Error ? error.message : String(error)
        }
      ],
      isError: true,
    };
  }
};

/**
 * Creates a new campaign
 */
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { accessToken, adAccountId } = req.body;
    
    if (!accessToken || !adAccountId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adAccountId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId
    });

    const result = await client.createCampaign(req.body.campaignConfig);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Retrieves all campaigns for an ad account
 */
export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const { accessToken, adAccountId } = req.query as {
      accessToken?: string;
      adAccountId?: string;
    };
    
    if (!accessToken || !adAccountId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adAccountId'
      });
    }

    const { limit, status, datePreset } = req.query as {
      limit?: string;
      status?: string;
      datePreset?: string;
    };
    
    // Extract time range if provided
    const { since, until } = req.query as {
      since?: string;
      until?: string;
    };
    
    // Only include time range if both since and until are provided
    const timeRange = since && until ? { since, until } : undefined;

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId
    });

    const campaigns = await client.getCampaigns(
      limit ? parseInt(limit) : undefined,
      status,
      datePreset,
      timeRange
    );
    
    return res.status(200).json({
      success: true,
      data: campaigns
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Gets a specific campaign by ID
 */
export const getCampaign = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.query as { accessToken?: string };
    const campaignId = req.params.campaignId;
    
    if (!accessToken || !campaignId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and campaignId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for getCampaign operation
    });

    const campaign = await client.getCampaign(campaignId);
    
    return res.status(200).json({
      success: true,
      data: campaign
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Updates an existing campaign
 */
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const campaignId = req.params.campaignId;
    
    if (!accessToken || !campaignId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and campaignId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for updateCampaign operation
    });

    const result = await client.updateCampaign(campaignId, req.body.campaignConfig);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Pauses an active campaign
 */
export const pauseCampaign = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const campaignId = req.params.campaignId;
    
    if (!accessToken || !campaignId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and campaignId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for pauseCampaign operation
    });

    const success = await client.pauseCampaign(campaignId);
    
    return res.status(200).json({
      success,
      data: { paused: success }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Creates a new ad set
 */
export const createAdSet = async (req: Request, res: Response) => {
  try {
    const { accessToken, adAccountId } = req.body;
    
    if (!accessToken || !adAccountId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adAccountId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId
    });

    const result = await client.createAdSet(req.body.adSetConfig);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Gets all ad sets for a campaign
 */
export const getAdSets = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.query as { accessToken?: string };
    const campaignId = req.params.campaignId;
    
    if (!accessToken || !campaignId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and campaignId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for getAdSets operation
    });

    const adSets = await client.getAdSets(campaignId);
    
    return res.status(200).json({
      success: true,
      data: adSets
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Gets all ad sets for an ad account
 */
export const getAccountAdSets = async (req: Request, res: Response) => {
  try {
    const { accessToken, adAccountId } = req.query as {
      accessToken?: string;
      adAccountId?: string;
    };
    
    if (!accessToken || !adAccountId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adAccountId'
      });
    }

    const { limit, status } = req.query as {
      limit?: string;
      status?: string;
    };

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId
    });

    const adSets = await client.getAccountAdSets(
      limit ? parseInt(limit) : undefined,
      status
    );
    
    return res.status(200).json({
      success: true,
      data: adSets
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Gets a specific ad set by ID
 */
export const getAdSet = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.query as { accessToken?: string };
    const adSetId = req.params.adSetId;
    
    if (!accessToken || !adSetId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adSetId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for getAdSet operation
    });

    const adSet = await client.getAdSet(adSetId);
    
    return res.status(200).json({
      success: true,
      data: adSet
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Updates an existing ad set
 */
export const updateAdSet = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const adSetId = req.params.adSetId;
    
    if (!accessToken || !adSetId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adSetId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for updateAdSet operation
    });

    const result = await client.updateAdSet(adSetId, req.body.adSetConfig);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Pauses an active ad set
 */
export const pauseAdSet = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const adSetId = req.params.adSetId;
    
    if (!accessToken || !adSetId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adSetId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for pauseAdSet operation
    });

    const success = await client.pauseAdSet(adSetId);
    
    return res.status(200).json({
      success,
      data: { paused: success }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Creates a new ad
 */
export const createAd = async (req: Request, res: Response) => {
  try {
    const { accessToken, adAccountId } = req.body;
    
    if (!accessToken || !adAccountId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adAccountId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId
    });

    const result = await client.createAd(req.body.adConfig);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Gets all ads for an ad set
 */
export const getAds = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.query as { accessToken?: string };
    const adSetId = req.params.adSetId;
    
    if (!accessToken || !adSetId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adSetId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for getAds operation
    });

    const ads = await client.getAds(adSetId);
    
    return res.status(200).json({
      success: true,
      data: ads
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Gets all ads for an ad account
 */
export const getAccountAds = async (req: Request, res: Response) => {
  try {
    const { accessToken, adAccountId } = req.query as {
      accessToken?: string;
      adAccountId?: string;
    };
    
    if (!accessToken || !adAccountId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adAccountId'
      });
    }

    const { limit, status } = req.query as {
      limit?: string;
      status?: string;
    };

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId
    });

    const ads = await client.getAccountAds(
      limit ? parseInt(limit) : undefined,
      status
    );
    
    return res.status(200).json({
      success: true,
      data: ads
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Gets a specific ad by ID
 */
export const getAd = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.query as { accessToken?: string };
    const adId = req.params.adId;
    
    if (!accessToken || !adId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for getAd operation
    });

    const ad = await client.getAd(adId);
    
    return res.status(200).json({
      success: true,
      data: ad
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Updates an existing ad
 */
export const updateAd = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const adId = req.params.adId;
    
    if (!accessToken || !adId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for updateAd operation
    });

    const result = await client.updateAd(adId, req.body.adConfig);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Pauses an active ad
 */
export const pauseAd = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const adId = req.params.adId;
    
    if (!accessToken || !adId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: accessToken and adId'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for pauseAd operation
    });

    const success = await client.pauseAd(adId);
    
    return res.status(200).json({
      success,
      data: { paused: success }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Gets available ad accounts for the user
 */
export const getAvailableAdAccounts = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.query as { accessToken?: string };
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: accessToken'
      });
    }

    const client = new FacebookMarketingClient({
      accessToken,
      adAccountId: 'dummy' // This value is not used for getAvailableAdAccounts operation
    });

    const accounts = await client.getAvailableAdAccounts();
    
    return res.status(200).json({
      success: true,
      data: accounts
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}; 