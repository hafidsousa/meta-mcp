/**
 * @fileoverview Default configuration for Facebook Marketing campaigns
 * 
 * @note For AI Assistants:
 * - All monetary values in cents (2000 = $20.00)
 * - This is a pure pass-through proxy, all types are loose for flexibility.
 */

import { config as loadEnv } from 'dotenv';
import { FacebookConfig } from './index';

// Load environment variables
loadEnv();

/**
 * Custom logger that writes to stderr to avoid mixing logs with JSON responses
 * @param message Message to log
 */
export function log(message: string) {
  console.error(message);
}

// Facebook API configuration from environment variables
export const fbConfig: FacebookConfig = {
  adAccountId: process.env.FB_AD_ACCOUNT_ID || '',
  accessToken: process.env.FB_ACCESS_TOKEN || '',
  appId: process.env.FB_APP_ID || '',
  appSecret: process.env.FB_APP_SECRET || ''
};

// Other configuration constants
export const SERVER_NAME = "meta-mcp";
export const SERVER_VERSION = "1.1.0";

// Default Campaign Configuration (using any for pure pass-through)
export const DEFAULT_CAMPAIGN_CONFIG: any = {
  objective: "CONVERSIONS",
  status: "PAUSED",
  special_ad_categories: [], // No special restrictions by default
  spend_cap: 0, // No default spend cap
  campaign_budget_optimization: true
};

// Default Ad Set Configuration (using any for pure pass-through)
export const DEFAULT_ADSET_CONFIG: any = {
  daily_budget: 5000, // $50.00 default daily budget
  status: "PAUSED", // Default to paused for safety
  bid_strategy: "LOWEST_COST_WITHOUT_CAP", // Default bid strategy
  targeting: {
    geo_locations: {
      countries: ["US"], // Default to US market
    },
    age_min: 18,
    age_max: 65,
    genders: [1, 2], // Target all genders by default
    publisher_platforms: ["facebook"], // Default to Facebook only
    facebook_positions: ["feed"], // Default to feed placements
    device_platforms: ["mobile", "desktop"], // Target all devices
    interests: [] // No default interests
  },
  optimization_goal: "CONVERSIONS",
  billing_event: "IMPRESSIONS",
  use_average_cost: false, // Don't use average cost bidding by default
  pacing_type: ["standard"] // Use standard pacing by default
};

// Default Ad Creative Configuration (using any for pure pass-through)
export const DEFAULT_CREATIVE_CONFIG: any = {
  call_to_action_type: "LEARN_MORE",
  format: "single_image" // Default to single image format
};

export const CAMPAIGN_NAME_FORMAT = '[Objective]-[Target]-[Date]';
export const ADSET_NAME_FORMAT = '[Target Audience]-[Placement]-[Date]';
export const AD_NAME_FORMAT = '[Creative Type]-[Target]-[Date]';

export const FB_API_VERSION = 'v22.0'; // Updated to latest version

/**
 * Merges default config with provided config
 * @param defaults Default configuration object
 * @param provided User provided configuration
 * @returns Merged configuration
 */
export function mergeConfig(defaults: Record<string, any>, provided: Record<string, any>): any {
  return {
    ...defaults,
    ...provided,
    // Deep merge for nested objects like targeting
    ...(provided && typeof provided === 'object' && Object.keys(provided).reduce((acc: Record<string, any>, key: string) => {
      const defaultValue = defaults[key];
      const providedValue = provided[key];
      
      if (defaultValue && typeof defaultValue === 'object' && providedValue && typeof providedValue === 'object') {
        acc[key] = mergeConfig(defaultValue, providedValue);
      }
      
      return acc;
    }, {}))
  };
} 