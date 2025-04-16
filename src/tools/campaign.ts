import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Creates a new Facebook ad campaign
 * This is the first step in the ad creation process
 * 
 * A campaign is the highest level organizational structure within an ad account and should 
 * represent a single objective for an advertiser, for example, to drive page post engagement.
 * Setting objective of the campaign will enforce validation on any ads added to the campaign 
 * to ensure they also have the correct objective.
 * 
 * Limits:
 * - You can only create 200 ad sets per ad campaign
 * - If your campaign has more than 70 ad sets and uses Campaign Budget Optimization, 
 *   you cannot edit your current bid strategy or turn off CBO
 */
export const CAMPAIGN_TOOL: Tool = {
  name: "createCampaign",
  description: "Creates a new Facebook ad campaign. This is the first step in the ad creation process. A campaign defines the overall objective and budget strategy. Use this before creating ad sets or ads.\n\nA campaign is the highest level organizational structure within an ad account and should represent a single objective for an advertiser. Important limits: (1) You can only create 200 ad sets per ad campaign. (2) If your campaign has more than 70 ad sets and uses Campaign Budget Optimization, you cannot edit your current bid strategy or turn off CBO.",
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
            description: "Campaign objective - what you want to achieve with this campaign. The objective you choose will enforce validation on any ads added to the campaign to ensure they also have the correct objective.",
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
            description: "Special ad categories for regulated content - REQUIRED by Facebook for all campaigns. If your ads do not belong to a special category, specify ['NONE'] or an empty array. Businesses running housing, employment, or credit ads must comply with targeting restrictions.", 
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
            description: "Daily budget in cents (e.g., 5000 = $50.00) - Cannot be used together with lifetimeBudget"
          },
          lifetimeBudget: {
            type: "number",
            description: "Total budget in cents for the campaign's lifetime (e.g., 100000 = $1,000.00) - Cannot be used together with dailyBudget. Requires stopTime to be set."
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
            description: "Bidding strategy for the campaign when using AUCTION as buying type and with campaign budget optimization enabled. Controls how your budget is spent. Note: TARGET_COST strategy has been deprecated since Marketing API v9. Options: LOWEST_COST_WITHOUT_CAP (automatic bidding, best for cost efficiency), LOWEST_COST_WITH_BID_CAP (manual maximum-cost bidding, requires bid_amount at ad set level), COST_CAP (limits average cost per optimization event, requires bid_amount at ad set level), LOWEST_COST_WITH_MIN_ROAS (aims for minimum return on ad spend).",
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
            description: "Enables Campaign Budget Optimization to automatically distribute budget across ad sets. Note: If you have more than 70 ad sets with CBO enabled, you cannot edit the bid strategy or turn off CBO.",
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
            description: "Additional specifications required for certain campaign objectives. Different fields are required based on the chosen objective.",
            properties: {
              pageId: { 
                type: "string", 
                description: "Facebook Page ID associated with this campaign - Required for PAGE_LIKES, EVENT_RESPONSES, MESSAGES, and more" 
              },
              applicationId: { 
                type: "string", 
                description: "App ID for app promotion campaigns - Required for APP_INSTALLS objective" 
              },
              objectStoreUrl: { 
                type: "string", 
                description: "App store URL for app installs - Used with APP_INSTALLS objective" 
              },
              pixelId: { 
                type: "string", 
                description: "Facebook Pixel ID for conversion tracking - Required for CONVERSIONS objective" 
              },
              customEventType: {
                type: "string",
                description: "Custom conversion event type - Used with CONVERSIONS objective"
              },
              productCatalogId: {
                type: "string",
                description: "Product catalog ID - Required for PRODUCT_CATALOG_SALES objective"
              },
              placePageSetId: {
                type: "string",
                description: "Place page set ID - Required for STORE_VISITS objective"
              },
              offerId: { 
                type: "string", 
                description: "Offer ID for offer promotions" 
              }
            }
          },
          isSkadnetworkAttribution: {
            type: "boolean",
            description: "Enable SKAdNetwork attribution for iOS app campaigns. REQUIRED to be set to true for campaigns targeting iOS 14.5+ devices.",
            default: false
          },
          buyingType: {
            type: "string",
            description: "Campaign buying type - AUCTION is standard for most campaigns, RESERVED is for guaranteed delivery",
            enum: ["AUCTION", "RESERVED"],
            default: "AUCTION"
          }
        },
        required: ["name", "objective", "specialAdCategories"]
      }
    },
    required: ["config"]
  }
};

/**
 * Gets all campaigns for the ad account
 * 
 * After your ads begin delivering, you can query stats for ad campaigns.
 * The statistics returned will be unique stats, deduped across the ad sets.
 */
export const GET_CAMPAIGNS_TOOL: Tool = {
  name: "getCampaigns",
  description: "Gets all campaigns for the ad account. Use this to retrieve existing campaigns for monitoring, editing, or to get campaign IDs needed for creating ad sets. Returns an array of campaign objects with their IDs, names, status, and other details. The statistics returned will be unique stats, deduped across the ad sets.",
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
      },
      datePreset: {
        type: "string",
        description: "Predefined date range for campaign stats. Note: 'lifetime' parameter is disabled in Graph API v10.0+ and replaced with 'maximum', which returns max 37 months of data.",
        enum: [
          "today", "yesterday", "this_month", "last_month", "this_quarter", 
          "maximum", "data_maximum", "last_3d", "last_7d", "last_14d", 
          "last_28d", "last_30d", "last_90d", "last_week_mon_sun", 
          "last_week_sun_sat", "last_quarter", "last_year", 
          "this_week_mon_today", "this_week_sun_today", "this_year"
        ]
      },
      timeRange: {
        type: "object",
        description: "Custom date range for campaign stats. Format: {'since':'YYYY-MM-DD','until':'YYYY-MM-DD'}",
        properties: {
          since: {
            type: "string",
            description: "Start date in YYYY-MM-DD format"
          },
          until: {
            type: "string",
            description: "End date in YYYY-MM-DD format"
          }
        },
        required: ["since", "until"]
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
  description: "Updates an existing campaign with new configuration values. Use this to modify campaign settings such as name, status, budget, objectives or other campaign-level parameters. Only the fields you include in the config will be updated. Note: If your campaign has more than 70 ad sets and uses Campaign Budget Optimization, you cannot edit your current bid strategy or turn off CBO.",
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
            description: "Campaign objective - determines optimization goals and ad formats available. Changing this may invalidate existing ad sets and ads.",
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
            description: "Special ad categories that apply to this campaign (REQUIRED for all campaigns). If your ads do not belong to a special category, specify ['NONE'] or an empty array.",
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
            description: "Total budget for the entire campaign duration (in account currency) - cannot be used with dailyBudget. Requires stopTime to be set.",
            minimum: 1
          },
          startTime: {
            type: "string",
            description: "Start date/time for campaign in ISO 8601 format (e.g., '2023-12-31T12:30:00-08:00')"
          },
          stopTime: {
            type: "string",
            description: "End date/time for campaign in ISO 8601 format (e.g., '2023-12-31T12:30:00-08:00'). Required if using lifetimeBudget."
          },
          bidStrategy: {
            type: "string",
            description: "Strategy to use for bidding with AUCTION buying type and campaign budget optimization. Note: If campaign has more than 70 ad sets with CBO enabled, you cannot edit the bid strategy. Options: LOWEST_COST_WITHOUT_CAP (best for cost efficiency), LOWEST_COST_WITH_BID_CAP (requires bid_amount at ad set level), COST_CAP (requires bid_amount at ad set level).",
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
            description: "Enable SKAdNetwork attribution for iOS app campaigns. REQUIRED to be set to true for campaigns targeting iOS 14.5+ devices.",
            default: false
          },
          campaignBudgetOptimization: {
            type: "boolean",
            description: "Enables Campaign Budget Optimization. Note: If campaign has more than 70 ad sets, you cannot turn this off once enabled.",
            default: false
          },
          promotedObject: {
            type: "object",
            description: "Additional specifications required for certain campaign objectives",
            properties: {
              pageId: { 
                type: "string", 
                description: "Facebook Page ID associated with this campaign" 
              },
              applicationId: { 
                type: "string", 
                description: "App ID for app promotion campaigns" 
              },
              pixelId: { 
                type: "string", 
                description: "Facebook Pixel ID for conversion tracking" 
              },
              customEventType: {
                type: "string",
                description: "Custom conversion event type"
              },
              productCatalogId: {
                type: "string",
                description: "Product catalog ID for catalog sales campaigns"
              }
            }
          }
        }
      }
    },
    required: ["campaignId", "config"]
  }
}; 