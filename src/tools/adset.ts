import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Creates a new ad set within a campaign
 */
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
            enum: ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"],
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
                  },
                  regions: {
                    type: "array",
                    description: "Region IDs for targeting specific states or provinces",
                    items: { 
                      type: "object",
                      properties: {
                        key: { type: "string", description: "Region key (e.g., '3847' for California)" }
                      },
                      required: ["key"]
                    }
                  },
                  cities: {
                    type: "array",
                    description: "City IDs for targeting specific cities",
                    items: { 
                      type: "object",
                      properties: {
                        key: { type: "string", description: "City key (e.g., '2418779' for New York)" },
                        radius: { type: "number", description: "Radius around city in miles" },
                        distance_unit: { 
                          type: "string", 
                          description: "Unit for radius measurement",
                          enum: ["mile", "kilometer"],
                          default: "mile" 
                        }
                      },
                      required: ["key"]
                    }
                  },
                  zips: {
                    type: "array",
                    description: "ZIP/Postal codes for detailed geographic targeting",
                    items: { 
                      type: "object",
                      properties: {
                        key: { type: "string", description: "ZIP/Postal code" }
                      },
                      required: ["key"]
                    }
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
              behaviors: {
                type: "array",
                description: "Behavior-based targeting. Targets users based on purchase behavior, device usage, etc.",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", description: "Facebook behavior ID" },
                    name: { type: "string", description: "Optional name for reference" }
                  },
                  required: ["id"]
                }
              },
              locales: {
                type: "array",
                description: "Language/locale targeting to reach people who use Facebook in specific languages",
                items: { type: "number", description: "Facebook locale ID (e.g., 6 for English)" }
              },
              exclusions: {
                type: "object",
                description: "Audiences to exclude from targeting",
                properties: {
                  interests: {
                    type: "array",
                    description: "Interest categories to exclude",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Facebook interest ID to exclude" },
                        name: { type: "string", description: "Optional name for reference" }
                      },
                      required: ["id"]
                    }
                  },
                  behaviors: {
                    type: "array",
                    description: "Behaviors to exclude",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Facebook behavior ID to exclude" },
                        name: { type: "string", description: "Optional name for reference" }
                      },
                      required: ["id"]
                    }
                  }
                }
              },
              publisherPlatforms: { 
                type: "array", 
                description: "Platforms to show ads on (e.g., ['facebook', 'instagram'])",
                items: { 
                  type: "string", 
                  enum: ["facebook", "instagram", "audience_network", "messenger"] 
                },
                default: ["facebook", "instagram"]
              },
              facebookPositions: { 
                type: "array", 
                description: "Positions on Facebook (e.g., ['feed', 'right_hand_column'])",
                items: { 
                  type: "string", 
                  enum: ["feed", "right_hand_column", "instant_article", "marketplace", "video_feeds", "story", "search", "instream_video"] 
                },
                default: ["feed"]
              },
              instagramPositions: { 
                type: "array", 
                description: "Positions on Instagram (e.g., ['stream', 'story'])",
                items: { 
                  type: "string", 
                  enum: ["stream", "story", "explore", "reels"] 
                },
                default: ["stream"]
              },
              devicePlatforms: {
                type: "array",
                description: "Target specific devices",
                items: {
                  type: "string",
                  enum: ["mobile", "desktop"]
                }
              },
              userOs: {
                type: "array",
                description: "Target specific operating systems",
                items: {
                  type: "string",
                  enum: ["iOS", "Android", "Windows", "macOS"]
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
            items: { 
              type: "object",
              properties: {
                eventType: { 
                  type: "string", 
                  description: "Type of event to attribute", 
                  enum: ["CLICK", "VIEW", "IMPRESSION"] 
                },
                windowDays: { 
                  type: "number", 
                  description: "Number of days after event to attribute conversions",
                  enum: [1, 7, 28]
                }
              }
            }
          },
          destinationType: { 
            type: "string", 
            description: "Destination type for the ad",
            enum: ["WEBSITE", "APP", "MESSENGER", "WHATSAPP", "INSTAGRAM_PROFILE", "FACEBOOK_EVENT"]
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
          },
          promotedObject: {
            type: "object",
            description: "Object being promoted by this ad set (app, page, event, etc.)",
            properties: {
              pageId: { type: "string", description: "Facebook Page ID for page promotion" },
              applicationId: { type: "string", description: "App ID for app promotion" },
              pixelId: { type: "string", description: "Pixel ID for conversion tracking" },
              customEventType: { 
                type: "string", 
                description: "Type of custom conversion event to optimize for",
                enum: ["COMPLETE_REGISTRATION", "ADD_TO_CART", "PURCHASE", "LEAD", "VIEW_CONTENT"]
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

/**
 * Gets all ad sets for a specific campaign
 */
export const GET_ADSETS_TOOL: Tool = {
  name: "getAdSets",
  description: "Gets all ad sets for a specific campaign. Use this to monitor performance, retrieve ad set IDs for creating ads, or to check the status of ad sets within a campaign. Returns an array of ad set objects.",
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
 * Gets all ad sets across all campaigns in the ad account
 */
export const GET_ACCOUNT_ADSETS_TOOL: Tool = {
  name: "getAccountAdSets",
  description: "Gets all ad sets across all campaigns in the ad account. Useful for getting a comprehensive view of all ad sets regardless of which campaign they belong to. Supports filtering by status and limiting results.",
  inputSchema: {
    type: "object",
    properties: {
      limit: { 
        type: "number", 
        description: "Maximum number of ad sets to return (default: 25, max: 100)",
        minimum: 1,
        maximum: 100
      },
      status: { 
        type: "string", 
        description: "Filter ad sets by status - only returns ad sets with this status",
        enum: ["ACTIVE", "PAUSED", "ARCHIVED", "ALL"],
        default: "ALL"
      }
    }
  }
};

/**
 * Gets detailed information for a specific ad set
 */
export const GET_ADSET_TOOL: Tool = {
  name: "getAdSet",
  description: "Gets detailed information for a specific ad set. Use this when you need comprehensive data about a single ad set including targeting, budget, schedule, and performance metrics.",
  inputSchema: {
    type: "object",
    properties: {
      adSetId: { 
        type: "string", 
        description: "Ad set ID (format: '23843xxxxxxxx') - obtain this from createAdSet response or getAdSets" 
      }
    },
    required: ["adSetId"]
  }
};

/**
 * Pauses an active ad set and its ads
 */
export const PAUSE_ADSET_TOOL: Tool = {
  name: "pauseAdSet",
  description: "Pauses an active ad set and all of its associated ads. Use this when you want to temporarily stop showing ads from a specific ad set while keeping the campaign active. Other ad sets in the same campaign will continue running.",
  inputSchema: {
    type: "object",
    properties: {
      adSetId: { 
        type: "string", 
        description: "Ad set ID (format: '23843xxxxxxxx') - obtain this from getAdSets response" 
      }
    },
    required: ["adSetId"]
  }
};

/**
 * Updates an existing ad set with new configuration values
 */
export const UPDATE_ADSET_TOOL: Tool = {
  name: "updateAdSet",
  description: "Updates an existing ad set with new configuration values. Use this to modify targeting, budget, schedule, or other settings of an ad set that's already been created. Only the fields you specify will be updated.",
  inputSchema: {
    type: "object",
    properties: {
      adSetId: { 
        type: "string", 
        description: "Ad set ID (format: '23843xxxxxxxx') - obtain this from getAdSets response" 
      },
      config: { 
        type: "object", 
        description: "Ad set configuration with fields to update. Only include fields you want to change.",
        properties: {
          name: { 
            type: "string", 
            description: "New ad set name - update to make it more descriptive or reflect changes in targeting" 
          },
          status: { 
            type: "string", 
            description: "New status - used to pause or reactivate an ad set",
            enum: ["ACTIVE", "PAUSED"],
            default: "PAUSED"
          },
          dailyBudget: { 
            type: "number", 
            description: "New daily budget in cents (e.g., 5000 = $50.00) - increase or decrease based on performance" 
          },
          lifetimeBudget: { 
            type: "number", 
            description: "New lifetime budget in cents for the entire ad set - alternative to dailyBudget" 
          },
          bidAmount: { 
            type: "number", 
            description: "New bid amount in cents for auction-based bidding - adjust based on competition and performance" 
          },
          bidStrategy: { 
            type: "string", 
            description: "New bid strategy for the ad set - changes how Facebook optimizes your spending",
            enum: ["LOWEST_COST_WITHOUT_CAP", "LOWEST_COST_WITH_BID_CAP", "COST_CAP"]
          },
          targeting: { 
            type: "object", 
            description: "New targeting specifications to replace current targeting - completely replaces existing targeting", 
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
                maximum: 65
              },
              ageMax: { 
                type: "number", 
                description: "Maximum age (13-65)", 
                minimum: 13, 
                maximum: 65
              },
              genders: { 
                type: "array", 
                description: "Gender targeting: [1] = male only, [2] = female only, [1,2] = all genders",
                items: { type: "number", enum: [1, 2] }
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
              }
            }
          },
          optimizationGoal: { 
            type: "string", 
            description: "New optimization goal - what you want to optimize the ad set for",
            enum: ["NONE", "APP_INSTALLS", "IMPRESSIONS", "LINK_CLICKS", "REACH", 
                   "CONVERSIONS", "PAGE_LIKES", "LEAD_GENERATION", "LANDING_PAGE_VIEWS"]
          },
          billingEvent: { 
            type: "string", 
            description: "New billing event determining how you're charged",
            enum: ["APP_INSTALLS", "IMPRESSIONS", "LINK_CLICKS", "NONE", 
                   "PAGE_LIKES", "POST_ENGAGEMENT", "THRUPLAY"]
          },
          startTime: { 
            type: "string", 
            description: "New start time in ISO 8601 format (e.g., '2025-06-15T12:00:00+0000') - reschedules when ads begin" 
          },
          endTime: { 
            type: "string", 
            description: "New end time in ISO 8601 format - updates when the ad set will stop running" 
          },
          pacingType: { 
            type: "array", 
            description: "New pacing type for budget distribution throughout the day",
            items: { type: "string", enum: ["standard", "day_parting"] }
          },
          attributionSpec: { 
            type: "array", 
            description: "New attribution settings for conversion tracking",
            items: { type: "object" }
          }
        }
      }
    },
    required: ["adSetId", "config"]
  }
}; 