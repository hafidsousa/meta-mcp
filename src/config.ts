/**
 * @fileoverview Default configuration for Facebook Marketing campaigns
 * 
 * @note For AI Assistants:
 * - All monetary values in cents (2000 = $20.00)
 */

import { CampaignConfig, AdSetConfig, AdCreativeConfig, FacebookConfig, CampaignObjective, CampaignStatus } from './types';
import { config as loadEnv } from 'dotenv';

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

export const DEFAULT_CAMPAIGN_CONFIG: Partial<CampaignConfig> = {
  objective: CampaignObjective.CONVERSIONS,
  status: CampaignStatus.PAUSED,
  specialAdCategories: [], // No special restrictions by default
  spendCap: 0, // No default spend cap
  campaignBudgetOptimization: true
};

export const DEFAULT_ADSET_CONFIG: Partial<AdSetConfig> = {
  dailyBudget: 5000, // $50.00 default daily budget
  status: 'PAUSED', // Default to paused for safety
  bidStrategy: 'LOWEST_COST_WITHOUT_CAP', // Default bid strategy
  targeting: {
    geoLocations: {
      countries: ['US'], // Default to US market
    },
    ageMin: 18,
    ageMax: 65,
    genders: [1, 2], // Target all genders by default
    publisherPlatforms: ['facebook'], // Default to Facebook only
    facebookPositions: ['feed'], // Default to feed placements
    devicePlatforms: ['mobile', 'desktop'], // Target all devices
    interests: [] // No default interests
  },
  optimizationGoal: 'CONVERSIONS',
  billingEvent: 'IMPRESSIONS',
  useAverageCost: false, // Don't use average cost bidding by default
  pacingType: ['standard'] // Use standard pacing by default
};

export const DEFAULT_CREATIVE_CONFIG: Partial<AdCreativeConfig> = {
  callToAction: 'LEARN_MORE',
  format: 'single_image' // Default to single image format
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
export function mergeConfig<T>(defaults: Partial<T>, provided: Partial<T>): T {
  return {
    ...defaults,
    ...provided,
    // Deep merge for nested objects like targeting
    ...(provided && typeof provided === 'object' && Object.keys(provided).reduce((acc, key) => {
      const defaultValue = (defaults as any)[key];
      const providedValue = (provided as any)[key];
      
      if (defaultValue && typeof defaultValue === 'object' && providedValue && typeof providedValue === 'object') {
        (acc as any)[key] = mergeConfig(defaultValue, providedValue);
      }
      
      return acc;
    }, {}))
  } as T;
} 