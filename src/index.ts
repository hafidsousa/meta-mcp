// Re-export what clients will need
export * from './tools/index';

export * from './client';
export * from './config';
// Define FacebookConfig inline instead of importing from shared
export * from './server';
export * from './utils/api';
export * from './operations/campaign';
export * from './operations/adset';
export * from './operations/ad';
export * from './operations/account';

// Export the FacebookConfig interface directly instead of from shared
export interface FacebookConfig {
  accessToken: string;
  adAccountId: string;
  appId?: string;
  appSecret?: string;
}

// Export other types as any for pass-through proxy
export type CampaignConfig = any;
export type AdSetConfig = any;
export type AdConfig = any;
export type AdCreativeConfig = any;
export type CampaignResponse = any;
export type AdSetResponse = any;
export type AdResponse = any;

// Add enums as string constants for backward compatibility
export const CampaignStatus = {
  ACTIVE: "ACTIVE",
  PAUSED: "PAUSED",
  DELETED: "DELETED",
  ARCHIVED: "ARCHIVED"
};

export const CampaignObjective = {
  CONVERSIONS: "CONVERSIONS",
  OUTCOME_SALES: "OUTCOME_SALES",
  OUTCOME_TRAFFIC: "OUTCOME_TRAFFIC",
  OUTCOME_AWARENESS: "OUTCOME_AWARENESS",
  OUTCOME_ENGAGEMENT: "OUTCOME_ENGAGEMENT"
};

export const BidStrategy = {
  LOWEST_COST_WITHOUT_CAP: "LOWEST_COST_WITHOUT_CAP",
  LOWEST_COST_WITH_BID_CAP: "LOWEST_COST_WITH_BID_CAP",
  COST_CAP: "COST_CAP",
  LOWEST_COST_WITH_MIN_ROAS: "LOWEST_COST_WITH_MIN_ROAS"
};

// Re-export default configurations
export {
  DEFAULT_CAMPAIGN_CONFIG,
  DEFAULT_ADSET_CONFIG,
  DEFAULT_CREATIVE_CONFIG,
  FB_API_VERSION
} from './config';

// Re-export main functionality
export {
  FacebookMarketingClient
} from './client'; 