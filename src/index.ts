export * from './client';
export * from './config';
export * from './types';
export * from './server';
export * from './utils/api';
export * from './operations/campaign';
export * from './operations/adset';
export * from './operations/ad';
export * from './operations/account';

// Re-export commonly used types
export type {
  FacebookConfig,
  CampaignConfig,
  AdSetConfig,
  AdConfig,
  AdCreativeConfig,
  CampaignResponse,
  AdSetResponse,
  AdResponse
} from './types';

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