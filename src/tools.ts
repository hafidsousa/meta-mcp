import { Tool } from "@modelcontextprotocol/sdk/types.js";

// Campaign Tools
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
          name: { type: "string", description: "Campaign name - should be descriptive for easy identification" },
          objective: { type: "string", description: "Campaign objective (e.g., 'CONVERSIONS', 'MESSAGES', 'REACH', 'TRAFFIC', 'APP_INSTALLS', 'VIDEO_VIEWS')" },
          status: { type: "string", description: "Campaign status ('ACTIVE' to launch immediately, 'PAUSED' to set up but not activate)" },
          specialAdCategories: { type: "array", description: "Special ad categories if applicable (e.g., ['HOUSING', 'CREDIT', 'EMPLOYMENT', 'ISSUES_ELECTIONS_POLITICS'])" }
        },
        required: ["name", "objective"]
      }
    },
    required: ["config"]
  }
};

export const GET_CAMPAIGNS_TOOL: Tool = {
  name: "getCampaigns",
  description: "Gets all campaigns for the ad account. Use this to retrieve existing campaigns for monitoring, editing, or to get campaign IDs needed for creating ad sets. Returns an array of campaign objects with their IDs, names, status, and other details.",
  inputSchema: {
    type: "object",
    properties: {}
  }
};

export const PAUSE_CAMPAIGN_TOOL: Tool = {
  name: "pauseCampaign",
  description: "Pauses an active campaign, which also pauses all associated ad sets and ads. Use this when you need to temporarily stop all advertising activity under a campaign. You can later reactivate the campaign using updateCampaign.",
  inputSchema: {
    type: "object",
    properties: {
      campaignId: { type: "string", description: "Campaign ID (format: '23843xxxxxxxx') - obtain this from getCampaigns response" }
    },
    required: ["campaignId"]
  }
};

// Ad Set Tools
export const ADSET_TOOL: Tool = {
  name: "createAdSet",
  description: "Creates a new ad set within a campaign. Ad sets define targeting, budget, scheduling, and bidding for your ads. You must create a campaign first, then create ad sets within that campaign. Each ad set can contain multiple ads targeting the same audience.",
  inputSchema: {
    type: "object",
    properties: {
      config: {
        type: "object",
        description: "Ad set configuration defining audience targeting and budget settings",
        properties: {
          name: { 
            type: "string", 
            description: "Ad set name - ideally describes the audience or targeting approach" 
          },
          campaignId: { 
            type: "string", 
            description: "Parent campaign ID (format: '23843xxxxxxxx') - obtain this from createCampaign response or getCampaigns" 
          },
          status: { 
            type: "string", 
            description: "Ad set status ('ACTIVE' to launch immediately, 'PAUSED' to set up but not activate)", 
            enum: ["ACTIVE", "PAUSED"],
            default: "PAUSED"
          },
          dailyBudget: { 
            type: "number", 
            description: "Daily budget in cents (e.g., 5000 = $50.00). Must be at least 100 (= $1.00)" 
          },
          lifetimeBudget: { 
            type: "number", 
            description: "Lifetime budget in cents (e.g., 100000 = $1,000.00). Alternative to dailyBudget - don't use both." 
          },
          startTime: { 
            type: "string", 
            description: "When to start running ads in ISO 8601 format (e.g., '2025-04-20T12:00:00+0000'). If not specified, ads start immediately." 
          },
          endTime: { 
            type: "string", 
            description: "When to stop running ads in ISO 8601 format (e.g., '2025-05-20T12:00:00+0000'). Required if using lifetimeBudget." 
          },
          optimizationGoal: { 
            type: "string", 
            description: "What results to optimize for (e.g., 'LINK_CLICKS', 'IMPRESSIONS', 'REACH', 'CONVERSIONS')",
            enum: ["NONE", "APP_INSTALLS", "AD_RECALL_LIFT", "ENGAGED_USERS", "EVENT_RESPONSES", "IMPRESSIONS", 
                  "LEAD_GENERATION", "QUALITY_LEAD", "LINK_CLICKS", "OFFSITE_CONVERSIONS", "PAGE_LIKES", 
                  "POST_ENGAGEMENT", "QUALITY_CALL", "REACH", "LANDING_PAGE_VIEWS", "VISIT_INSTAGRAM_PROFILE", 
                  "VALUE", "THRUPLAY", "DERIVED_EVENTS", "CONVERSIONS"],
            default: "LINK_CLICKS"
          },
          billingEvent: { 
            type: "string", 
            description: "When you get charged (e.g., 'IMPRESSIONS', 'LINK_CLICKS', 'APP_INSTALLS')",
            enum: ["APP_INSTALLS", "IMPRESSIONS", "LINK_CLICKS", "NONE", "PAGE_LIKES", "POST_ENGAGEMENT", "THRUPLAY"],
            default: "IMPRESSIONS" 
          },
          bidAmount: { 
            type: "number", 
            description: "Bid amount in cents. Only use when needed for specific bid strategies." 
          },
          bidStrategy: { 
            type: "string", 
            description: "How to optimize bidding. Usually leave as default for best results.",
            enum: ["LOWEST_COST_WITHOUT_CAP", "LOWEST_COST_WITH_BID_CAP", "COST_CAP"],
            default: "LOWEST_COST_WITHOUT_CAP"
          },
          targeting: { 
            type: "object", 
            description: "Targeting specifications object defining the audience", 
            properties: {
              geoLocations: {
                type: "object",
                description: "Geographic targeting settings",
                properties: {
                  countries: { 
                    type: "array", 
                    description: "Country codes (e.g., ['US', 'CA'] for United States and Canada)",
                    items: { type: "string" }
                  }
                }
              },
              ageMin: { 
                type: "number", 
                description: "Minimum age (13-65)", 
                minimum: 13, 
                maximum: 65,
                default: 18 
              },
              ageMax: { 
                type: "number", 
                description: "Maximum age (13-65)", 
                minimum: 13, 
                maximum: 65,
                default: 65 
              },
              genders: { 
                type: "array", 
                description: "Gender targeting: [1] = male only, [2] = female only, [1,2] = all genders",
                items: { type: "number", enum: [1, 2] },
                default: [1, 2]
              },
              interests: { 
                type: "array", 
                description: "Interest-based targeting. Each interest needs Facebook's interest ID.",
                items: { 
                  type: "object", 
                  properties: {
                    id: { type: "string", description: "Facebook interest ID" },
                    name: { type: "string", description: "Optional name for reference" }
                  },
                  required: ["id"]
                }
              },
              publisherPlatforms: { 
                type: "array", 
                description: "Platforms to show ads on (e.g., ['facebook', 'instagram'])",
                items: { 
                  type: "string", 
                  enum: ["facebook", "instagram", "audience_network", "messenger"] 
                }
              },
              facebookPositions: { 
                type: "array", 
                description: "Positions on Facebook (e.g., ['feed', 'right_hand_column'])",
                items: { 
                  type: "string", 
                  enum: ["feed", "right_hand_column", "instant_article", "marketplace", "video_feeds", "story", "search", "instream_video"] 
                }
              },
              instagramPositions: { 
                type: "array", 
                description: "Positions on Instagram (e.g., ['stream', 'story'])",
                items: { 
                  type: "string", 
                  enum: ["stream", "story", "explore", "reels"] 
                }
              }
            }
          },
          pacingType: { 
            type: "array", 
            description: "Pacing type determines how budget is spent throughout the day",
            items: { type: "string", enum: ["standard", "day_parting"] },
            default: ["standard"]
          },
          attributionSpec: { 
            type: "array", 
            description: "Attribution settings for conversion tracking",
            items: { type: "object" }
          },
          destinationType: { 
            type: "string", 
            description: "Destination type for the ad" 
          },
          adSchedules: { 
            type: "array", 
            description: "Schedule specific hours/days when ads should run",
            items: { 
              type: "object", 
              properties: {
                days: { type: "array", items: { type: "number" }, description: "Days of week (0-6, where 0 is Sunday)" },
                hours: { type: "array", items: { type: "number" }, description: "Hours (0-23)" },
                minutes: { type: "array", items: { type: "number" }, description: "Minutes (0, 15, 30, 45)" }
              }
            }
          }
        },
        required: ["name", "campaignId", "targeting"]
      }
    },
    required: ["config"]
  }
};

export const GET_ADSETS_TOOL: Tool = {
  name: "getAdSets",
  description: "Gets all ad sets for a specific campaign. Use this to monitor performance, retrieve ad set IDs for creating ads, or to check the status of ad sets within a campaign. Returns an array of ad set objects.",
  inputSchema: {
    type: "object",
    properties: {
      campaignId: { type: "string", description: "Campaign ID (format: '23843xxxxxxxx') - obtain this from getCampaigns response" }
    },
    required: ["campaignId"]
  }
};

export const GET_ACCOUNT_ADSETS_TOOL: Tool = {
  name: "getAccountAdSets",
  description: "Gets all ad sets across all campaigns in the ad account. Useful for getting a comprehensive view of all ad sets regardless of which campaign they belong to. Supports filtering by status and limiting results.",
  inputSchema: {
    type: "object",
    properties: {
      limit: { type: "number", description: "Optional limit on number of ad sets to return (e.g., 10, 25, 50)" },
      status: { type: "string", description: "Optional status filter ('ACTIVE', 'PAUSED', 'ARCHIVED', etc.) to only show ad sets with that status" }
    }
  }
};

export const GET_ADSET_TOOL: Tool = {
  name: "getAdSet",
  description: "Gets detailed information for a specific ad set. Use this when you need comprehensive data about a single ad set including targeting, budget, schedule, and performance metrics.",
  inputSchema: {
    type: "object",
    properties: {
      adSetId: { type: "string", description: "Ad set ID (format: '23843xxxxxxxx') - obtain this from createAdSet response or getAdSets" }
    },
    required: ["adSetId"]
  }
};

export const PAUSE_ADSET_TOOL: Tool = {
  name: "pauseAdSet",
  description: "Pauses an active ad set and all of its associated ads. Use this when you want to temporarily stop showing ads from a specific ad set while keeping the campaign active. Other ad sets in the same campaign will continue running.",
  inputSchema: {
    type: "object",
    properties: {
      adSetId: { type: "string", description: "Ad set ID (format: '23843xxxxxxxx') - obtain this from getAdSets response" }
    },
    required: ["adSetId"]
  }
};

export const UPDATE_ADSET_TOOL: Tool = {
  name: "updateAdSet",
  description: "Updates an existing ad set with new configuration values. Use this to modify targeting, budget, schedule, or other settings of an ad set that's already been created. Only the fields you specify will be updated.",
  inputSchema: {
    type: "object",
    properties: {
      adSetId: { type: "string", description: "Ad set ID (format: '23843xxxxxxxx') - obtain this from getAdSets response" },
      config: { 
        type: "object", 
        description: "Ad set configuration with fields to update. Only include fields you want to change.",
        properties: {
          name: { type: "string", description: "New ad set name" },
          status: { type: "string", description: "New status ('ACTIVE' or 'PAUSED')" },
          dailyBudget: { type: "number", description: "New daily budget in cents (e.g., 5000 = $50.00)" },
          lifetimeBudget: { type: "number", description: "New lifetime budget in cents for the entire ad set" },
          bidAmount: { type: "number", description: "New bid amount in cents for auction-based bidding" },
          targeting: { type: "object", description: "New targeting specifications to replace current targeting" },
          optimizationGoal: { type: "string", description: "New optimization goal (e.g., 'REACH', 'IMPRESSIONS', 'LINK_CLICKS')" },
          billingEvent: { type: "string", description: "New billing event determining how you're charged (e.g., 'IMPRESSIONS', 'LINK_CLICKS')" }
        }
      }
    },
    required: ["adSetId", "config"]
  }
};

// Ad Tools
export const AD_TOOL: Tool = {
  name: "createAd",
  description: "Creates a new ad within an ad set. This is the final step in the ad creation workflow after creating a campaign and ad set. An ad contains the actual creative content (images, videos, text) shown to users. Multiple ads can be created within a single ad set to test different creatives.",
  inputSchema: {
    type: "object",
    properties: {
      config: {
        type: "object",
        description: "Ad configuration containing the creative elements and settings",
        properties: {
          name: { type: "string", description: "Ad name - should describe the creative for easy identification" },
          adsetId: { type: "string", description: "Parent ad set ID (format: '23843xxxxxxxx') - obtain this from createAdSet response or getAdSets" },
          creative: { type: "object", description: "Ad creative configuration containing images/videos, text, headlines, descriptions, and call-to-action buttons" }
        },
        required: ["name", "adsetId", "creative"]
      }
    },
    required: ["config"]
  }
};

export const GET_ADS_TOOL: Tool = {
  name: "getAds",
  description: "Gets all ads for a specific ad set. Use this to monitor performance of different creatives within the same ad set, retrieve ad IDs for updates, or check the status of existing ads.",
  inputSchema: {
    type: "object",
    properties: {
      adSetId: { type: "string", description: "Ad set ID (format: '23843xxxxxxxx') - obtain this from getAdSets response" }
    },
    required: ["adSetId"]
  }
};

export const GET_ACCOUNT_ADS_TOOL: Tool = {
  name: "getAccountAds",
  description: "Gets all ads across all ad sets and campaigns in the ad account. Provides a comprehensive view of all active ads. Useful for account-wide monitoring and management. Supports filtering by status and limiting results.",
  inputSchema: {
    type: "object",
    properties: {
      limit: { type: "number", description: "Optional limit on number of ads to return (e.g., 10, 25, 50)" },
      status: { type: "string", description: "Optional status filter ('ACTIVE', 'PAUSED', 'ARCHIVED', etc.) to only show ads with that status" }
    }
  }
};

export const GET_AD_TOOL: Tool = {
  name: "getAd",
  description: "Gets detailed information for a specific ad including its creative elements, performance metrics, and status. Use this when you need comprehensive data about a single ad.",
  inputSchema: {
    type: "object",
    properties: {
      adId: { type: "string", description: "Ad ID (format: '23843xxxxxxxx') - obtain this from createAd response or getAds" }
    },
    required: ["adId"]
  }
};

export const PAUSE_AD_TOOL: Tool = {
  name: "pauseAd",
  description: "Pauses an active ad. Use this when you want to stop showing a specific ad while keeping other ads in the same ad set active. This allows for granular control over which creatives are being shown.",
  inputSchema: {
    type: "object",
    properties: {
      adId: { type: "string", description: "Ad ID (format: '23843xxxxxxxx') - obtain this from getAds response" }
    },
    required: ["adId"]
  }
};

export const UPDATE_AD_TOOL: Tool = {
  name: "updateAd",
  description: "Updates an existing ad with new configuration values. Use this to modify the creative elements, name, or status of an ad that's already been created. Only the fields you specify will be updated.",
  inputSchema: {
    type: "object",
    properties: {
      adId: { type: "string", description: "Ad ID (format: '23843xxxxxxxx') - obtain this from getAds response" },
      config: { 
        type: "object", 
        description: "Ad configuration with fields to update. Only include fields you want to change.",
        properties: {
          name: { type: "string", description: "New ad name for identification" },
          status: { type: "string", description: "New ad status ('ACTIVE' or 'PAUSED')" },
          creative: { type: "object", description: "New ad creative configuration to replace current creative elements" }
        }
      }
    },
    required: ["adId", "config"]
  }
};

// Account Tools
export const GET_ACCOUNTS_TOOL: Tool = {
  name: "getAvailableAdAccounts",
  description: "Gets all available ad accounts that the authenticated user has access to. This is often the first call you should make to identify which ad account to work with if managing multiple accounts. Returns account IDs, names, and other account-level information.",
  inputSchema: {
    type: "object",
    properties: {}
  }
};

// Get all available tools
export const getAllTools = (): Tool[] => [
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
  GET_ACCOUNT_ADS_TOOL,
  GET_AD_TOOL,
  UPDATE_AD_TOOL,
  GET_ACCOUNT_ADSETS_TOOL,
  GET_ADSET_TOOL,
  UPDATE_ADSET_TOOL,
]; 