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
          name: { 
            type: "string", 
            description: "Ad name - should describe the creative for easy identification (e.g., 'Product-Image-Blue-Desktop')" 
          },
          adsetId: { 
            type: "string", 
            description: "Parent ad set ID (format: '23843xxxxxxxx') - obtain this from createAdSet response or getAdSets" 
          },
          status: { 
            type: "string", 
            description: "Ad status - determines whether the ad will run immediately",
            enum: ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"],
            default: "PAUSED"
          },
          bidAmount: { 
            type: "number", 
            description: "Optional bid amount in cents - overrides the ad set bid if specified" 
          },
          creative: { 
            type: "object", 
            description: "Ad creative configuration containing the visual and text elements",
            properties: {
              name: { 
                type: "string", 
                description: "Creative name for reference and organization" 
              },
              title: { 
                type: "string", 
                description: "Ad headline - keep under 40 characters for best results. This is the main text users will see." 
              },
              body: { 
                type: "string", 
                description: "Ad body text - keep under 125 characters for best results. Describes your offer in more detail." 
              },
              imageUrl: { 
                type: "string", 
                description: "URL of the image to use - must be publicly accessible. Recommended size: 1200x628 pixels." 
              },
              videoUrl: { 
                type: "string", 
                description: "URL of the video to use - must be publicly accessible. Alternative to imageUrl for video ads." 
              },
              linkUrl: { 
                type: "string", 
                description: "Landing page URL where users will go when clicking the ad" 
              },
              callToAction: { 
                type: "string", 
                description: "Call to action button text",
                enum: [
                  "BOOK_TRAVEL", "CONTACT_US", "DONATE", "DOWNLOAD", "GET_OFFER", 
                  "GET_QUOTE", "LEARN_MORE", "PLAY_GAME", "SHOP_NOW", "SIGN_UP", 
                  "SUBSCRIBE", "WATCH_MORE"
                ],
                default: "LEARN_MORE"
              },
              urlTags: { 
                type: "string", 
                description: "Additional URL parameters for tracking (e.g., 'utm_source=facebook&utm_medium=cpc')" 
              },
              format: { 
                type: "string", 
                description: "Creative format - determines the ad layout",
                enum: ["single_image", "carousel", "video", "slideshow"],
                default: "single_image" 
              },
              objectStorySpec: { 
                type: "object", 
                description: "Page post ad specifications - for creating ads from Page posts", 
                properties: {
                  pageId: { 
                    type: "string", 
                    description: "Facebook Page ID that will publish the ad" 
                  },
                  instagramActorId: { 
                    type: "string", 
                    description: "Instagram account ID for Instagram placement ads" 
                  },
                  linkData: { 
                    type: "object", 
                    description: "Link ad specifications" 
                  },
                  photoData: { 
                    type: "object", 
                    description: "Photo ad specifications" 
                  },
                  videoData: { 
                    type: "object", 
                    description: "Video ad specifications" 
                  }
                }
              }
            },
            required: ["title", "body", "linkUrl"]
          },
          trackingSpecs: { 
            type: "array", 
            description: "Additional tracking specifications for advanced conversion tracking",
            items: { type: "object" }
          },
          conversionDomain: { 
            type: "string", 
            description: "Domain for conversion attribution - must match a verified domain in your Business Manager" 
          },
          adlabels: { 
            type: "array", 
            description: "Labels to categorize and organize ads",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Label name" }
              },
              required: ["name"]
            }
          },
          displaySequence: { 
            type: "number", 
            description: "Display sequence within campaign - controls the order of ads" 
          },
          engagementAudience: { 
            type: "boolean", 
            description: "Whether to create an engagement custom audience from this ad",
            default: false
          }
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
      adSetId: { 
        type: "string", 
        description: "Ad set ID (format: '23843xxxxxxxx') - obtain this from getAdSets response" 
      }
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
      limit: { 
        type: "number", 
        description: "Maximum number of ads to return (default: 25, max: 100)",
        minimum: 1,
        maximum: 100
      },
      status: { 
        type: "string", 
        description: "Filter ads by status - only returns ads with this status",
        enum: ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED", "ALL"],
        default: "ALL"
      }
    }
  }
};

export const GET_AD_TOOL: Tool = {
  name: "getAd",
  description: "Gets detailed information for a specific ad including its creative elements, performance metrics, and status. Use this when you need comprehensive data about a single ad.",
  inputSchema: {
    type: "object",
    properties: {
      adId: { 
        type: "string", 
        description: "Ad ID (format: '23843xxxxxxxx') - obtain this from createAd response or getAds" 
      }
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
      adId: { 
        type: "string", 
        description: "Ad ID (format: '23843xxxxxxxx') - obtain this from getAds response" 
      }
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
      adId: { 
        type: "string", 
        description: "Ad ID (format: '23843xxxxxxxx') - obtain this from getAds response" 
      },
      config: { 
        type: "object", 
        description: "Ad configuration with fields to update. Only include fields you want to change.",
        properties: {
          name: { 
            type: "string", 
            description: "New ad name for identification - update to better describe the ad creative or purpose" 
          },
          status: { 
            type: "string", 
            description: "New ad status - used to pause or activate the ad",
            enum: ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"],
            default: "PAUSED"
          },
          bidAmount: { 
            type: "number", 
            description: "New bid amount in cents - allows adjusting bid at the ad level for better performance" 
          },
          creative: { 
            type: "object", 
            description: "New ad creative configuration to replace current creative elements - completely replaces existing creative",
            properties: {
              name: { 
                type: "string", 
                description: "Creative name for reference and organization" 
              },
              title: { 
                type: "string", 
                description: "Ad headline - keep under 40 characters for best results" 
              },
              body: { 
                type: "string", 
                description: "Ad body text - keep under 125 characters for best results" 
              },
              imageUrl: { 
                type: "string", 
                description: "URL of the image to use - must be publicly accessible" 
              },
              videoUrl: { 
                type: "string", 
                description: "URL of the video to use - must be publicly accessible" 
              },
              linkUrl: { 
                type: "string", 
                description: "Landing page URL where users will go when clicking the ad" 
              },
              callToAction: { 
                type: "string", 
                description: "Call to action button text",
                enum: [
                  "BOOK_TRAVEL", "CONTACT_US", "DONATE", "DOWNLOAD", "GET_OFFER", 
                  "GET_QUOTE", "LEARN_MORE", "PLAY_GAME", "SHOP_NOW", "SIGN_UP", 
                  "SUBSCRIBE", "WATCH_MORE"
                ]
              },
              urlTags: { 
                type: "string", 
                description: "Additional URL parameters for tracking (e.g., 'utm_source=facebook&utm_medium=cpc')" 
              }
            }
          },
          trackingSpecs: { 
            type: "array", 
            description: "New tracking specifications for this ad - replaces existing tracking",
            items: { type: "object" }
          },
          conversionDomain: { 
            type: "string", 
            description: "New domain for conversion attribution - must match a verified domain in your Business Manager" 
          },
          adlabels: { 
            type: "array", 
            description: "New labels to categorize and organize ads - replaces existing labels",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Label name" }
              },
              required: ["name"]
            }
          }
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
  UPDATE_CAMPAIGN_TOOL,
]; 