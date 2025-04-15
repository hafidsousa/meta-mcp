import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Creates a new Facebook ad campaign
 * This is the first step in the ad creation process
 */
export const CAMPAIGN_TOOL: Tool = {
  name: "createCampaign",
  description: "Creates a new Facebook ad campaign. This is the first step in the ad creation process. A campaign defines the overall objective and budget strategy. Use this before creating ad sets or ads.",
  inputSchema: {
    type: "object",
    properties: {
      config: {
        type: "object",
        description: "Campaign configuration object containing essential settings for the campaign",
        properties: {
          name: { 
            type: "string", 
            description: "Campaign name - should be descriptive for easy identification (e.g., 'Summer-Sale-2025' or 'Product-Launch-Q2')" 
          },
          objective: { 
            type: "string", 
            description: "Campaign objective - what you want to achieve with this campaign",
            enum: [
              "APP_INSTALLS", "BRAND_AWARENESS", "CONVERSIONS", "EVENT_RESPONSES", 
              "LEAD_GENERATION", "LINK_CLICKS", "LOCAL_AWARENESS", "MESSAGES", 
              "OUTCOME_AWARENESS", "OUTCOME_ENGAGEMENT", "OUTCOME_LEADS",
              "OUTCOME_SALES", "OUTCOME_TRAFFIC", "OUTCOME_APP_PROMOTION",
              "PAGE_LIKES", "POST_ENGAGEMENT", "REACH", "STORE_VISITS", "VIDEO_VIEWS"
            ]
          },
          status: { 
            type: "string", 
            description: "Campaign status ('ACTIVE' to launch immediately, 'PAUSED' to set up but not activate)",
            enum: ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"],
            default: "PAUSED"
          },
          specialAdCategories: { 
            type: "array", 
            description: "Special ad categories for regulated content - required by Facebook for certain industries", 
            items: {
              type: "string",
              enum: ["NONE", "EMPLOYMENT", "HOUSING", "CREDIT", "ISSUES_ELECTIONS_POLITICS"]
            },
            default: ["NONE"]
          },
          spendCap: {
            type: "number",
            description: "Maximum amount to spend on the campaign in cents (e.g., 1000000 = $10,000.00) - prevents overspending"
          },
          dailyBudget: {
            type: "number",
            description: "Daily budget in cents (e.g., 5000 = $50.00) - Alternative to lifetimeBudget, don't use both"
          },
          lifetimeBudget: {
            type: "number",
            description: "Total budget in cents for the campaign's lifetime (e.g., 100000 = $1,000.00) - Alternative to dailyBudget"
          },
          startTime: {
            type: "string",
            description: "When to start running the campaign in ISO 8601 format (e.g., '2025-06-15T12:00:00+0000')"
          },
          stopTime: {
            type: "string",
            description: "When to stop running the campaign in ISO 8601 format - Required if using lifetimeBudget"
          },
          bidStrategy: {
            type: "string",
            description: "Bidding strategy for the campaign - Controls how your budget is spent",
            enum: [
              "LOWEST_COST_WITHOUT_CAP", 
              "LOWEST_COST_WITH_BID_CAP", 
              "COST_CAP", 
              "LOWEST_COST_WITH_MIN_ROAS"
            ],
            default: "LOWEST_COST_WITHOUT_CAP"
          },
          campaignBudgetOptimization: {
            type: "boolean",
            description: "Enables Campaign Budget Optimization to automatically distribute budget across ad sets",
            default: false
          },
          minRoasTargetValue: {
            type: "number",
            description: "Minimum ROAS (Return on Ad Spend) target value - Only use with bidStrategy LOWEST_COST_WITH_MIN_ROAS"
          },
          adLabels: {
            type: "array",
            description: "Labels to organize and categorize the campaign",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Label name for reference" }
              },
              required: ["name"]
            }
          },
          boostedObjectId: {
            type: "string",
            description: "ID of the boosted object (e.g., post, page) - Used for boost-type campaigns"
          },
          promotedObject: {
            type: "object",
            description: "Additional specifications for certain campaign objectives",
            properties: {
              pageId: { 
                type: "string", 
                description: "Facebook Page ID associated with this campaign" 
              },
              applicationId: { 
                type: "string", 
                description: "App ID for app promotion campaigns" 
              },
              objectStoreUrl: { 
                type: "string", 
                description: "App store URL for app installs" 
              },
              pixelId: { 
                type: "string", 
                description: "Facebook Pixel ID for conversion tracking" 
              },
              offerId: { 
                type: "string", 
                description: "Offer ID for offer promotions" 
              }
            }
          },
          isSkadnetworkAttribution: {
            type: "boolean",
            description: "Enable SKAdNetwork attribution for iOS app campaigns",
            default: false
          }
        },
        required: ["name", "objective"]
      }
    },
    required: ["config"]
  }
};

/**
 * Gets all campaigns for the ad account
 */
export const GET_CAMPAIGNS_TOOL: Tool = {
  name: "getCampaigns",
  description: "Gets all campaigns for the ad account. Use this to retrieve existing campaigns for monitoring, editing, or to get campaign IDs needed for creating ad sets. Returns an array of campaign objects with their IDs, names, status, and other details.",
  inputSchema: {
    type: "object",
    properties: {
      limit: { 
        type: "number", 
        description: "Maximum number of campaigns to return (default: 25, max: 100)",
        minimum: 1,
        maximum: 100
      },
      status: { 
        type: "string", 
        description: "Filter campaigns by status - only returns campaigns with this status",
        enum: ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED", "ALL"],
        default: "ALL"
      }
    }
  }
};

/**
 * Pauses an active campaign
 */
export const PAUSE_CAMPAIGN_TOOL: Tool = {
  name: "pauseCampaign",
  description: "Pauses an active campaign, which also pauses all associated ad sets and ads. Use this when you need to temporarily stop all advertising activity under a campaign. You can later reactivate the campaign using updateCampaign.",
  inputSchema: {
    type: "object",
    properties: {
      campaignId: { 
        type: "string", 
        description: "Campaign ID (format: '23843xxxxxxxx') - obtain this from getCampaigns response" 
      }
    },
    required: ["campaignId"]
  }
};

/**
 * Updates an existing campaign with new configuration values
 */
export const UPDATE_CAMPAIGN_TOOL: Tool = {
  name: "updateCampaign",
  description: "Updates an existing campaign with new configuration values. Use this to modify campaign settings such as name, status, budget, objectives or other campaign-level parameters. Only the fields you include in the config will be updated.",
  inputSchema: {
    type: "object",
    properties: {
      campaignId: {
        type: "string",
        description: "Campaign ID to update (format: '23843xxxxxxxx') - obtain this from getCampaigns response"
      },
      config: {
        type: "object",
        description: "Configuration object containing fields to update. Only include fields you want to change.",
        properties: {
          name: {
            type: "string",
            description: "New name for the campaign"
          },
          status: {
            type: "string",
            description: "Updated campaign status",
            enum: ["ACTIVE", "PAUSED", "ARCHIVED"],
            examples: ["ACTIVE"]
          },
          objective: {
            type: "string",
            description: "Campaign objective - determines optimization goals and ad formats available",
            enum: [
              "APP_INSTALLS", 
              "BRAND_AWARENESS", 
              "CONVERSIONS", 
              "EVENT_RESPONSES", 
              "LEAD_GENERATION", 
              "LINK_CLICKS", 
              "LOCAL_AWARENESS", 
              "MESSAGES", 
              "OFFER_CLAIMS", 
              "PAGE_LIKES", 
              "POST_ENGAGEMENT", 
              "PRODUCT_CATALOG_SALES", 
              "REACH", 
              "STORE_VISITS", 
              "VIDEO_VIEWS"
            ]
          },
          specialAdCategories: {
            type: "array",
            description: "Special ad categories that apply to this campaign (required for certain regulated industries)",
            items: {
              type: "string",
              enum: [
                "NONE", 
                "EMPLOYMENT", 
                "HOUSING", 
                "CREDIT", 
                "ISSUES_ELECTIONS_POLITICS", 
                "ONLINE_GAMBLING_AND_GAMING"
              ]
            },
            default: ["NONE"]
          },
          spendCap: {
            type: "number",
            description: "Maximum amount to spend on this campaign over its lifetime (in account currency)",
            minimum: 1
          },
          dailyBudget: {
            type: "number",
            description: "Daily budget limit for the campaign (in account currency) - cannot be used with lifetimeBudget",
            minimum: 1
          },
          lifetimeBudget: {
            type: "number",
            description: "Total budget for the entire campaign duration (in account currency) - cannot be used with dailyBudget",
            minimum: 1
          },
          startTime: {
            type: "string",
            description: "Start date/time for campaign in ISO 8601 format (e.g., '2023-12-31T12:30:00-08:00')"
          },
          stopTime: {
            type: "string",
            description: "End date/time for campaign in ISO 8601 format (e.g., '2023-12-31T12:30:00-08:00')"
          },
          bidStrategy: {
            type: "string",
            description: "Strategy to use for bidding",
            enum: [
              "LOWEST_COST_WITHOUT_CAP", 
              "LOWEST_COST_WITH_BID_CAP", 
              "COST_CAP"
            ],
            default: "LOWEST_COST_WITHOUT_CAP"
          },
          buyingType: {
            type: "string",
            description: "Campaign buying type",
            enum: ["AUCTION", "RESERVED"],
            default: "AUCTION"
          },
          isSkadnetworkAttribution: {
            type: "boolean",
            description: "Enable SKAdNetwork attribution for iOS app campaigns",
            default: false
          }
        }
      }
    },
    required: ["campaignId", "config"]
  }
}; 