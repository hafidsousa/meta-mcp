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
export const CREATE_CAMPAIGN_TOOL: Tool = {
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
              "OFFER_CLAIMS", "OUTCOME_APP_PROMOTION", "OUTCOME_AWARENESS", "OUTCOME_ENGAGEMENT", 
              "OUTCOME_LEADS", "OUTCOME_SALES", "OUTCOME_TRAFFIC", "PAGE_LIKES", 
              "POST_ENGAGEMENT", "PRODUCT_CATALOG_SALES", "REACH", "STORE_VISITS", "VIDEO_VIEWS"
            ]
          },
          status: { 
            type: "string", 
            description: "Campaign status ('ACTIVE' to launch immediately, 'PAUSED' to set up but not activate)",
            enum: ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"],
            default: "PAUSED"
          },
          special_ad_categories: { 
            type: "array", 
            description: "Special ad categories for regulated content - REQUIRED by Facebook for all campaigns. If your ads do not belong to a special category, specify ['NONE'] or an empty array. Businesses running housing, employment, or credit ads must comply with targeting restrictions.", 
            items: {
              type: "string",
              enum: ["NONE", "EMPLOYMENT", "HOUSING", "CREDIT", "ISSUES_ELECTIONS_POLITICS", "ONLINE_GAMBLING_AND_GAMING", "FINANCIAL_PRODUCTS_SERVICES"]
            },
            default: ["NONE"]
          },
          special_ad_category_country: {
            type: "array",
            description: "Countries where special ad category restrictions apply",
            items: {
              type: "string",
              enum: ["US", "CA", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AN", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"]
            }
          },
          spend_cap: {
            type: "number",
            description: "Maximum amount to spend on the campaign in cents (e.g., 1000000 = $10,000.00) - prevents overspending. Minimum value is $100 USD. Set to 922337203685478 to remove the spend cap."
          },
          daily_budget: {
            type: "number",
            description: "Daily budget in cents (e.g., 5000 = $50.00) - Cannot be used together with lifetime_budget"
          },
          lifetime_budget: {
            type: "number",
            description: "Total budget in cents for the campaign's lifetime (e.g., 100000 = $1,000.00) - Cannot be used together with daily_budget. Requires stop_time to be set."
          },
          start_time: {
            type: "string",
            description: "When to start running the campaign in ISO 8601 format (e.g., '2025-06-15T12:00:00+0000')"
          },
          stop_time: {
            type: "string",
            description: "When to stop running the campaign in ISO 8601 format - Required if using lifetime_budget"
          },
          bid_strategy: {
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
          campaign_budget_optimization: {
            type: "boolean",
            description: "Enables Campaign Budget Optimization to automatically distribute budget across ad sets. Note: If you have more than 70 ad sets with CBO enabled, you cannot edit the bid strategy or turn off CBO.",
            default: false
          },
          min_roas_target_value: {
            type: "number",
            description: "Minimum ROAS (Return on Ad Spend) target value - Only use with bid_strategy LOWEST_COST_WITH_MIN_ROAS"
          },
          adlabels: {
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
          budget_schedule_specs: {
            type: "array",
            description: "Initial high demand periods to be created with the campaign",
            items: {
              type: "object",
              properties: {
                time_start: { type: "number", description: "Start time as unix timestamp" },
                time_end: { type: "number", description: "End time as unix timestamp" },
                budget_value: { type: "number", description: "Budget value for this period" },
                budget_value_type: { 
                  type: "string", 
                  description: "Type of budget value",
                  enum: ["ABSOLUTE"]
                }
              },
              required: ["time_start", "time_end", "budget_value", "budget_value_type"]
            }
          },
          campaign_optimization_type: {
            type: "string",
            description: "Campaign optimization type",
            enum: ["NONE", "ICO_ONLY"]
          },
          execution_options: {
            type: "array",
            description: "Execution settings for API call - validate_only: to check values without creating, include_recommendations: to include suggestions",
            items: {
              type: "string",
              enum: ["validate_only", "include_recommendations"]
            }
          },
          is_skadnetwork_attribution: {
            type: "boolean",
            description: "Enable SKAdNetwork attribution for iOS app campaigns. REQUIRED to be set to true for campaigns targeting iOS 14.5+ devices.",
            default: false
          },
          is_using_l3_schedule: {
            type: "boolean",
            description: "Whether the campaign uses L3 scheduling"
          },
          iterative_split_test_configs: {
            type: "array",
            description: "Array of Iterative Split Test Configs created under this campaign",
            items: {
              type: "object"
            }
          },
          promoted_object: {
            type: "object",
            description: "The object this campaign is promoting across all its ads. Required for Meta iOS 14+ app promotion campaigns. Different fields are required based on the chosen objective.",
            properties: {
              page_id: { 
                type: "string", 
                description: "Facebook Page ID associated with this campaign - Required for PAGE_LIKES, EVENT_RESPONSES, MESSAGES, and more" 
              },
              application_id: { 
                type: "string", 
                description: "App ID for app promotion campaigns - Required for APP_INSTALLS objective" 
              },
              object_store_url: { 
                type: "string", 
                description: "App store URL for app installs - Used with APP_INSTALLS objective" 
              },
              pixel_id: { 
                type: "string", 
                description: "Facebook Pixel ID for conversion tracking - Required for CONVERSIONS objective" 
              },
              custom_event_type: {
                type: "string",
                description: "Custom conversion event type - Used with CONVERSIONS objective"
              },
              product_catalog_id: {
                type: "string",
                description: "Product catalog ID - Required for PRODUCT_CATALOG_SALES objective"
              },
              place_page_set_id: {
                type: "string",
                description: "Place page set ID - Required for STORE_VISITS objective"
              },
              offer_id: { 
                type: "string", 
                description: "Offer ID for offer promotions" 
              }
            }
          },
          source_campaign_id: {
            type: "string",
            description: "Used if a campaign has been copied. The ID from the original campaign that was copied."
          },
          buying_type: {
            type: "string",
            description: "Campaign buying type - AUCTION is standard for most campaigns, RESERVED is for guaranteed delivery (reach and frequency ads)",
            enum: ["AUCTION", "RESERVED"],
            default: "AUCTION"
          },
          topline_id: {
            type: "string",
            description: "Topline ID"
          }
        },
        required: ["name", "objective", "special_ad_categories"]
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
      date_preset: {
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
      time_range: {
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
      campaign_id: { 
        type: "string", 
        description: "Campaign ID (format: '23843xxxxxxxx') - obtain this from getCampaigns response" 
      }
    },
    required: ["campaign_id"]
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
      campaign_id: {
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
            description: "Updated campaign status. Only ACTIVE and PAUSED are valid during creation. Other statuses can be used for update. If it is set to PAUSED, its active child objects will be paused and have an effective status CAMPAIGN_PAUSED.",
            enum: ["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"],
            examples: ["ACTIVE"]
          },
          objective: {
            type: "string",
            description: "Campaign objective - determines optimization goals and ad formats available. If it is specified the API will validate that any ads created under the campaign match that objective. Currently, with BRAND_AWARENESS objective, all creatives should be either only images or only videos, not mixed.",
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
              "OUTCOME_APP_PROMOTION",
              "OUTCOME_AWARENESS",
              "OUTCOME_ENGAGEMENT",
              "OUTCOME_LEADS",
              "OUTCOME_SALES",
              "OUTCOME_TRAFFIC",
              "PAGE_LIKES", 
              "POST_ENGAGEMENT", 
              "PRODUCT_CATALOG_SALES", 
              "REACH", 
              "STORE_VISITS", 
              "VIDEO_VIEWS"
            ]
          },
          special_ad_categories: {
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
                "ONLINE_GAMBLING_AND_GAMING",
                "FINANCIAL_PRODUCTS_SERVICES"
              ]
            },
            default: ["NONE"]
          },
          special_ad_category: {
            type: "string",
            description: "Special ad category that applies to this campaign",
            enum: [
              "NONE", 
              "EMPLOYMENT", 
              "HOUSING", 
              "CREDIT", 
              "ISSUES_ELECTIONS_POLITICS", 
              "ONLINE_GAMBLING_AND_GAMING",
              "FINANCIAL_PRODUCTS_SERVICES"
            ],
            default: "NONE"
          },
          special_ad_category_country: {
            type: "array",
            description: "Countries where special ad category restrictions apply",
            items: {
              type: "string",
              enum: ["US", "CA", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AN", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"]
            }
          },
          spend_cap: {
            type: "number",
            description: "Maximum amount to spend on this campaign over its lifetime (in account currency). Defined as integer value of subunit in your currency with a minimum value of $100 USD (or approximate local equivalent). Set the value to 922337203685478 to remove the spend cap. Not available for Reach and Frequency or Premium Self Serve campaigns.",
            minimum: 1
          },
          daily_budget: {
            type: "number",
            description: "Daily budget limit for the campaign (in account currency) - cannot be used with lifetime_budget. All adsets under this campaign will share this budget. You can either set budget at the campaign level or at the adset level, not both.",
            minimum: 1
          },
          lifetime_budget: {
            type: "number",
            description: "Total budget for the entire campaign duration (in account currency) - cannot be used with daily_budget. Requires stop_time to be set. All adsets under this campaign will share this budget. You can either set budget at the campaign level or at the adset level, not both.",
            minimum: 1
          },
          start_time: {
            type: "string",
            description: "Start date/time for campaign in ISO 8601 format (e.g., '2023-12-31T12:30:00-08:00')"
          },
          stop_time: {
            type: "string",
            description: "End date/time for campaign in ISO 8601 format (e.g., '2023-12-31T12:30:00-08:00'). Required if using lifetime_budget."
          },
          bid_strategy: {
            type: "string",
            description: "Strategy to use for bidding with AUCTION buying type and campaign budget optimization. Note: If campaign has more than 70 ad sets with CBO enabled, you cannot edit the bid strategy. Options: LOWEST_COST_WITHOUT_CAP (best for cost efficiency, also known as automatic bidding), LOWEST_COST_WITH_BID_CAP (manual maximum-cost bidding, requires bid_amount at ad set level), COST_CAP (limits average cost per optimization event, requires bid_amount at ad set level). Note: TARGET_COST bidding strategy has been deprecated with Marketing API v9.",
            enum: [
              "LOWEST_COST_WITHOUT_CAP",
              "LOWEST_COST_WITH_BID_CAP",
              "COST_CAP",
              "LOWEST_COST_WITH_MIN_ROAS"
            ],
            default: "LOWEST_COST_WITHOUT_CAP"
          },
          buying_type: {
            type: "string",
            description: "Campaign buying type",
            enum: ["AUCTION", "RESERVED"],
            default: "AUCTION"
          },
          is_skadnetwork_attribution: {
            type: "boolean",
            description: "Enable SKAdNetwork attribution for iOS app campaigns. Flag to indicate that the campaign will be using SKAdNetwork, which also means that it will only be targeting iOS 14.x and above.",
            default: false
          },
          campaign_budget_optimization: {
            type: "boolean",
            description: "Enables Campaign Budget Optimization. Note: If campaign has more than 70 ad sets, you cannot turn this off once enabled.",
            default: false
          },
          promoted_object: {
            type: "object",
            description: "The object this campaign is promoting across all its ads. Only product_catalog_id is used at the ad set level.",
            properties: {
              page_id: { 
                type: "string", 
                description: "Facebook Page ID associated with this campaign" 
              },
              application_id: { 
                type: "string", 
                description: "App ID for app promotion campaigns" 
              },
              pixel_id: { 
                type: "string", 
                description: "Facebook Pixel ID for conversion tracking" 
              },
              custom_event_type: {
                type: "string",
                description: "Custom conversion event type"
              },
              product_catalog_id: {
                type: "string",
                description: "Product catalog ID for catalog sales campaigns"
              }
            }
          },
          adlabels: {
            type: "array",
            description: "Labels to organize and categorize the campaign",
            items: {
              type: "object",
              properties: {
                name: { 
                  type: "string", 
                  description: "Label name for reference" 
                }
              },
              required: ["name"]
            }
          },
          adset_bid_amounts: {
            type: "object",
            description: "A map of child adset IDs to their respective bid amounts required in the process of toggling campaign from autobid to manual bid",
            additionalProperties: {
              type: "number"
            }
          },
          adset_budgets: {
            type: "array",
            description: "An array of maps containing all the non-deleted child adset IDs and either daily_budget or lifetime_budget, required in the process of toggling between campaign budget and adset budget",
            items: {
              type: "object",
              properties: {
                adset_id: {
                  type: "string",
                  description: "ID of the ad set"
                },
                daily_budget: {
                  type: "number",
                  description: "Daily budget for the ad set"
                },
                lifetime_budget: {
                  type: "number",
                  description: "Lifetime budget for the ad set"
                }
              },
              required: ["adset_id"]
            }
          },
          budget_rebalance_flag: {
            type: "boolean",
            description: "Whether to automatically rebalance budgets daily for all the adsets under this campaign."
          },
          campaign_optimization_type: {
            type: "string",
            description: "Campaign optimization type",
            enum: ["NONE", "ICO_ONLY"]
          },
          execution_options: {
            type: "array",
            description: "Execution settings for API call - validate_only: to check values without creating, include_recommendations: to include suggestions. If the call passes validation or review, response will be {\"success\": true}. If not, an error will be returned with more details.",
            items: {
              type: "string",
              enum: ["validate_only", "include_recommendations"]
            }
          },
          is_using_l3_schedule: {
            type: "boolean",
            description: "Whether the campaign uses L3 scheduling."
          },
          iterative_split_test_configs: {
            type: "array",
            description: "Array of Iterative Split Test Configs created under this campaign.",
            items: {
              type: "object"
            }
          },
          smart_promotion_type: {
            type: "string",
            description: "Smart promotion type for the campaign",
            enum: ["GUIDED_CREATION", "SMART_APP_PROMOTION"]
          }
        }
      }
    },
    required: ["campaign_id", "config"]
  }
}; 