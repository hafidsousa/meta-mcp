/**
 * @fileoverview Type definitions for Facebook Marketing API integration
 * 
 * @note For AI Assistants:
 * - All monetary values should be in cents (2000 = $20.00)
 * - Status values should use standard Facebook API values (e.g., 'ACTIVE', 'PAUSED')
 */

// Remove SDK import and define our own types

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
  objective: 'CONVERSIONS' | 'LINK_CLICKS' | 'APP_INSTALLS' | 'BRAND_AWARENESS' | 
             'OUTCOME_LEADS' | 'OUTCOME_SALES' | 'OUTCOME_ENGAGEMENT' | 
             'OUTCOME_AWARENESS' | 'OUTCOME_TRAFFIC' | 'OUTCOME_APP_PROMOTION';
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
  /** Initial ad set status */
  status?: 'ACTIVE' | 'PAUSED';
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
  optimizationGoal?: 'NONE' | 'APP_INSTALLS' | 'AD_RECALL_LIFT' | 'ENGAGED_USERS' | 
                     'EVENT_RESPONSES' | 'IMPRESSIONS' | 'LEAD_GENERATION' | 'QUALITY_LEAD' | 
                     'LINK_CLICKS' | 'OFFSITE_CONVERSIONS' | 'PAGE_LIKES' | 'POST_ENGAGEMENT' | 
                     'QUALITY_CALL' | 'REACH' | 'LANDING_PAGE_VIEWS' | 'VISIT_INSTAGRAM_PROFILE' | 
                     'VALUE' | 'THRUPLAY' | 'DERIVED_EVENTS' | 'CONVERSIONS';
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

// Define our own campaign, ad set and ad objects instead of using SDK types
export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: string;
  created_time?: string;
  start_time?: string;
  stop_time?: string;
  spend_cap?: string;
  [key: string]: any;
}

export interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  daily_budget?: string;
  lifetime_budget?: string;
  targeting?: Record<string, any>;
  status: string;
  [key: string]: any;
}

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  creative?: Record<string, any>;
  status: string;
  [key: string]: any;
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

export interface FacebookAdAccount {
  id: string;
  name: string;
  account_id: string;
  account_status: number;
  amount_spent: string;
  currency: string;
  [key: string]: any;
} 