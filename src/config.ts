/**
 * @fileoverview Default configuration for Facebook Marketing campaigns
 * 
 * @note For AI Assistants:
 * - All monetary values in cents (2000 = $20.00)
 */

import { CampaignConfig, AdSetConfig, AdCreativeConfig } from './types';

export const DEFAULT_CAMPAIGN_CONFIG: Partial<CampaignConfig> = {
  objective: 'CONVERSIONS',
  status: 'PAUSED', // Default to paused for safety
  specialAdCategories: [] // No special restrictions by default
};

export const DEFAULT_ADSET_CONFIG: Partial<AdSetConfig> = {
  dailyBudget: 5000, // $50.00 default daily budget
  targeting: {
    geoLocations: {
      countries: ['US'], // Default to US market
    },
    ageMin: 18,
    ageMax: 65,
    genders: [1, 2], // Target all genders by default
    interests: [] // No default interests
  },
  optimizationGoal: 'CONVERSIONS',
  billingEvent: 'IMPRESSIONS'
};

export const DEFAULT_CREATIVE_CONFIG: Partial<AdCreativeConfig> = {
  callToAction: 'LEARN_MORE'
};

export const CAMPAIGN_NAME_FORMAT = '[Objective]-[Target]-[Date]';
export const ADSET_NAME_FORMAT = '[Target Audience]-[Placement]-[Date]';
export const AD_NAME_FORMAT = '[Creative Type]-[Target]-[Date]';

export const FB_API_VERSION = 'v22.0'; // Updated to latest version

export interface FacebookApiConfig {
  accessToken: string;
  appId: string;
  appSecret: string;
  adAccountId: string;
  pageId: string;
  debug?: boolean;
}

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