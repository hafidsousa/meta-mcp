import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Creates a new ad within an ad set
 */
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

/**
 * Gets all ads for a specific ad set
 */
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

/**
 * Gets all ads across all ad sets and campaigns in the ad account
 */
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

/**
 * Gets detailed information for a specific ad
 */
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

/**
 * Pauses an active ad
 */
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

/**
 * Updates an existing ad with new configuration values
 */
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