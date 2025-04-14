/**
 * @fileoverview Type definitions for Facebook Marketing API integration
 * 
 * @note For AI Assistants:
 * - All monetary values should be in cents (2000 = $20.00)
 * - Status values should use proper enums (e.g., Campaign.Status.ACTIVE)
 */

import { Campaign, AdSet, Ad } from 'facebook-nodejs-business-sdk';

export interface FacebookConfig {
  /** Access token with ads_management permission */
  accessToken: string;
  /** Facebook App ID from developer console (optional when using MCP tools) */
  appId?: string;
  /** Facebook App Secret from developer console (optional when using MCP tools) */
  appSecret?: string;
  /** Facebook Ad Account ID (without 'act_' prefix) */
  adAccountId: string;
}

export interface CampaignConfig {
  /** Campaign name following format: [Objective]-[Target]-[Date] */
  name: string;
  /** Campaign objective */
  objective: 'CONVERSIONS' | 'LINK_CLICKS' | 'APP_INSTALLS' | 'BRAND_AWARENESS';
  /** Initial campaign status */
  status: 'ACTIVE' | 'PAUSED';
  /** Special ad category restrictions */
  specialAdCategories?: string[];
}

export interface AdSetConfig {
  /** Ad Set name following format: [Target Audience]-[Placement]-[Date] */
  name: string;
  /** Parent campaign ID */
  campaignId: string;
  /** Daily budget in cents */
  dailyBudget?: number;
  /** Lifetime budget in cents */
  lifetimeBudget?: number;
  /** When to start running ads */
  startTime?: string;
  /** Optional end time for the ad set */
  endTime?: string;
  /** Targeting configuration */
  targeting: {
    /** Geographic targeting */
    geoLocations?: {
      countries?: string[];
      regions?: string[];
      cities?: string[];
    };
    /** Minimum age */
    ageMin?: number;
    /** Maximum age */
    ageMax?: number;
    /** Gender targeting (1 = male, 2 = female) */
    genders?: number[];
    /** Interest targeting */
    interests?: string[];
  };
  /** Optimization goal */
  optimizationGoal?: string;
  /** Billing event type */
  billingEvent?: string;
}

export interface AdCreativeConfig {
  /** Creative name for reference */
  name: string;
  /** Ad headline - keep under 40 characters */
  title: string;
  /** Ad body text - keep under 125 characters */
  body: string;
  /** Image URL - must be public accessible */
  imageUrl?: string;
  /** Video URL if using video creative */
  videoUrl?: string;
  /** Landing page URL */
  linkUrl: string;
  /** Call to action button text */
  callToAction?: string;
}

export interface AdConfig {
  /** Ad name following format: [Creative Type]-[Target]-[Date] */
  name: string;
  /** Parent ad set ID */
  adsetId: string;
  /** Initial ad status */
  status: 'ACTIVE' | 'PAUSED';
  /** Creative configuration */
  creative: AdCreativeConfig;
}

export interface CampaignResponse {
  /** Created campaign ID */
  id: string;
  /** Whether creation was successful */
  success: boolean;
  /** Campaign data if creation was successful */
  data?: Campaign;
  /** Error details if creation failed */
  error?: any;
}

export interface AdSetResponse {
  /** Created ad set ID */
  id: string;
  /** Whether creation was successful */
  success: boolean;
  /** Ad set data if creation was successful */
  data?: AdSet;
  /** Error details if creation failed */
  error?: any;
}

export interface AdResponse {
  /** Created ad ID */
  id: string;
  /** Whether creation was successful */
  success: boolean;
  /** Ad data if creation was successful */
  data?: Ad;
  /** Error details if creation failed */
  error?: any;
}

// Extended FacebookAdsApi type to include missing methods
declare module 'facebook-nodejs-business-sdk' {
  interface FacebookAdsApi {
    createCampaign(config: CampaignConfig & { account_id: string }): Promise<Campaign>;
    createAdSet(config: AdSetConfig & { account_id: string }): Promise<AdSet>;
    createAd(config: AdConfig & { account_id: string }): Promise<Ad>;
    getAdSets(ids: string[]): Promise<AdSet[]>;
    getAds(ids: string[]): Promise<Ad[]>;
    call<T>(method: string, path: string, params?: Record<string, any>): Promise<T>;
  }
} 