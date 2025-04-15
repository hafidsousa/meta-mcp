/**
 * @fileoverview Type definitions for Facebook Marketing API integration
 * 
 * @note For AI Assistants:
 * - All monetary values should be in cents (2000 = $20.00)
 * - Status values should use standard Facebook API values (e.g., 'ACTIVE', 'PAUSED')
 * 
 * @see https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group
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

/**
 * Campaign Objectives as specified in Facebook Marketing API
 * @see https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group
 */
export enum CampaignObjective {
  OUTCOME_TRAFFIC = 'OUTCOME_TRAFFIC',
  OUTCOME_ENGAGEMENT = 'OUTCOME_ENGAGEMENT', 
  OUTCOME_SALES = 'OUTCOME_SALES',
  OUTCOME_LEADS = 'OUTCOME_LEADS',
  OUTCOME_AWARENESS = 'OUTCOME_AWARENESS',
  OUTCOME_APP_PROMOTION = 'OUTCOME_APP_PROMOTION',
  APP_INSTALLS = 'APP_INSTALLS',
  BRAND_AWARENESS = 'BRAND_AWARENESS',
  CONVERSIONS = 'CONVERSIONS',
  EVENT_RESPONSES = 'EVENT_RESPONSES',
  LEAD_GENERATION = 'LEAD_GENERATION',
  LINK_CLICKS = 'LINK_CLICKS',
  LOCAL_AWARENESS = 'LOCAL_AWARENESS',
  MESSAGES = 'MESSAGES',
  PAGE_LIKES = 'PAGE_LIKES',
  POST_ENGAGEMENT = 'POST_ENGAGEMENT',
  PRODUCT_CATALOG_SALES = 'PRODUCT_CATALOG_SALES',
  REACH = 'REACH',
  STORE_VISITS = 'STORE_VISITS',
  VIDEO_VIEWS = 'VIDEO_VIEWS'
}

/**
 * Campaign Status values
 */
export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DELETED = 'DELETED',
  ARCHIVED = 'ARCHIVED'
}

/**
 * Special Ad Categories
 */
export enum SpecialAdCategory {
  EMPLOYMENT = 'EMPLOYMENT',
  HOUSING = 'HOUSING',
  CREDIT = 'CREDIT',
  ISSUES_ELECTIONS_POLITICS = 'ISSUES_ELECTIONS_POLITICS',
  NONE = 'NONE'
}

/**
 * Bid Strategy options
 */
export enum BidStrategy {
  LOWEST_COST_WITHOUT_CAP = 'LOWEST_COST_WITHOUT_CAP',
  LOWEST_COST_WITH_BID_CAP = 'LOWEST_COST_WITH_BID_CAP',
  COST_CAP = 'COST_CAP',
  LOWEST_COST_WITH_MIN_ROAS = 'LOWEST_COST_WITH_MIN_ROAS'
}

export interface AdLabel {
  id: string;
  name: string;
  created_time?: string;
  updated_time?: string;
}

/**
 * Campaign configuration for creating new campaigns
 */
export interface CampaignConfig {
  /** Campaign name following format: [Objective]-[Target]-[Date] */
  name: string;
  /** Campaign objective */
  objective: CampaignObjective;
  /** Initial campaign status */
  status: CampaignStatus;
  /** Special ad category restrictions */
  specialAdCategories?: SpecialAdCategory[];
  /** Campaign spend cap in cents */
  spendCap?: number;
  /** Bid strategy for campaign when using campaign budget optimization */
  bidStrategy?: BidStrategy;
  /** Daily budget in cents */
  dailyBudget?: number;
  /** Lifetime budget in cents */
  lifetimeBudget?: number;
  /** Campaign budget optimization enabled */
  campaignBudgetOptimization?: boolean;
  /** ROAS (Return on Ad Spend) goal value */
  minRoasTargetValue?: number;
  /** Ad Labels associated with this campaign */
  adLabels?: { name: string }[];
  /** When to start running this campaign */
  startTime?: string;
  /** When to stop running this campaign */
  stopTime?: string;
  /** ID of the boosted object */
  boostedObjectId?: string;
  /** When the campaign was created */
  createdTime?: string;
  /** The source of this campaign */
  source_campaign_id?: string;
  /** ID of the Page or app that is being advertised */
  promotedObject?: {
    pageId?: string;
    applicationId?: string;
    objectStoreUrl?: string;
    customEventType?: string;
    offerId?: string;
    pixelId?: string;
    productSetId?: string;
    productCatalogId?: string;
    placePageSetId?: string;
  };
  /** Whether to use default buying type */
  useDefaultBuyingType?: boolean;
  /** Whether this campaign is optimized for buying type */
  isSkadnetworkAttribution?: boolean;
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
  /** When to start running ads (ISO 8601 format with timezone) */
  startTime?: string;
  /** Optional end time for the ad set (ISO 8601 format with timezone) */
  endTime?: string;
  /** Initial ad set status */
  status?: 'ACTIVE' | 'PAUSED';
  /** Optional bid amount in cents */
  bidAmount?: number;
  /** Bid strategy type */
  bidStrategy?: 'LOWEST_COST_WITHOUT_CAP' | 'LOWEST_COST_WITH_BID_CAP' | 'COST_CAP';
  /** Targeting configuration */
  targeting: {
    /** Geographic targeting */
    geoLocations?: {
      countries?: string[];
      regions?: { key: string }[];
      cities?: { key: string, radius?: number, distance_unit?: string }[];
      zips?: { key: string }[];
      geo_markets?: { key: string }[];
      electoral_districts?: { key: string }[];
    };
    /** Minimum age */
    ageMin?: number;
    /** Maximum age */
    ageMax?: number;
    /** Gender targeting (1 = male, 2 = female) */
    genders?: number[];
    /** Interest targeting */
    interests?: { id: string, name?: string }[];
    /** Publisher platforms (facebook, instagram, audience_network, messenger) */
    publisherPlatforms?: string[];
    /** Placement positions (feed, right_hand_column, instant_article, etc.) */
    facebookPositions?: string[];
    /** Instagram positions (stream, story, explore, reels) */
    instagramPositions?: string[];
    /** Device platforms (mobile, desktop) */
    devicePlatforms?: string[];
    /** Behavior targeting */
    behaviors?: { id: string, name?: string }[];
    /** Excluded interests */
    excludedInterests?: { id: string, name?: string }[];
    /** Excluded demographics */
    excludedDemographics?: { id: string, name?: string }[];
    /** Locales (languages) */
    locales?: number[];
    /** User OS */
    userOs?: string[];
    /** Mobile device targeting */
    userDevice?: string[];
    /** Flexible spec for advanced targeting with AND/OR logic */
    flexibleSpec?: Record<string, any>[];
    /** Excluded specs */
    exclusions?: Record<string, any>;
    /** Custom audiences */
    customAudiences?: { id: string, name?: string }[];
  };
  /** Optimization goal */
  optimizationGoal?: 'NONE' | 'APP_INSTALLS' | 'AD_RECALL_LIFT' | 'ENGAGED_USERS' | 
                     'EVENT_RESPONSES' | 'IMPRESSIONS' | 'LEAD_GENERATION' | 'QUALITY_LEAD' | 
                     'LINK_CLICKS' | 'OFFSITE_CONVERSIONS' | 'PAGE_LIKES' | 'POST_ENGAGEMENT' | 
                     'QUALITY_CALL' | 'REACH' | 'LANDING_PAGE_VIEWS' | 'VISIT_INSTAGRAM_PROFILE' | 
                     'VALUE' | 'THRUPLAY' | 'DERIVED_EVENTS' | 'CONVERSIONS';
  /** Billing event type */
  billingEvent?: 'APP_INSTALLS' | 'IMPRESSIONS' | 'LINK_CLICKS' | 'NONE' | 
                 'PAGE_LIKES' | 'POST_ENGAGEMENT' | 'THRUPLAY';
  /** Promoted object for specific campaign types (page_id, application_id, etc.) */
  promotedObject?: {
    pageId?: string;
    applicationId?: string;
    objectStoreUrl?: string;
    customEventType?: string;
    offerId?: string;
    pixelId?: string;
    pixelRule?: string;
    [key: string]: any;
  };
  /** Destination type for ads */
  destinationType?: string;
  /** Pacing type (standard or day_parting) */
  pacingType?: string[];
  /** Facebook attribution spec */
  attributionSpec?: Record<string, any>[];
  /** Use average cost bidding */
  useAverageCost?: boolean;
  /** Time-based ad scheduling */
  adSchedules?: {
    days: number[];
    hours: number[];
    minutes: number[];
  }[];
}

export interface AdCreativeConfig {
  /** Creative name for reference */
  name: string;
  /** Creative ID for existing creatives */
  creative_id?: string;
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
  /** Additional creative URL parameters */
  urlTags?: string;
  /** Creative format (single_image, carousel, video, etc) */
  format?: string;
  /** Object story spec for Page post ads */
  objectStorySpec?: {
    pageId?: string;
    instagramActorId?: string;
    linkData?: Record<string, any>;
    photoData?: Record<string, any>;
    videoData?: Record<string, any>;
  };
}

export interface AdConfig {
  /** Ad name following format: [Creative Type]-[Target]-[Date] */
  name: string;
  /** Parent ad set ID */
  adsetId: string;
  /** Initial ad status */
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  /** Creative configuration */
  creative: AdCreativeConfig;
  /** Tracking specs */
  trackingSpecs?: Record<string, any>[];
  /** Optional bid amount in cents */
  bidAmount?: number;
  /** Conversion domain for tracking */
  conversionDomain?: string;
  /** Ad labels associated with this ad */
  adlabels?: AdLabel[];
  /** Display sequence within campaign */
  display_sequence?: number;
  /** Engagement audience flag */
  engagement_audience?: boolean;
}

// Define our own campaign, ad set and ad objects instead of using SDK types
export interface Campaign {
  /** Campaign ID */
  id: string;
  /** Campaign name */
  name: string;
  /** Ad account ID */
  account_id?: string;
  /** Campaign objective */
  objective: string;
  /** Campaign status */
  status: CampaignStatus;
  /** List of ad labels */
  adlabels?: AdLabel[];
  /** Bid strategy */
  bid_strategy?: BidStrategy;
  /** The ID of the boosted object */
  boosted_object_id?: string;
  /** Budget rebalance flag */
  budget_rebalance_flag?: boolean;
  /** Budget remaining */
  budget_remaining?: string;
  /** Buying type (AUCTION or RESERVED) */
  buying_type?: string;
  /** Campaign group active status indicator */
  can_create_brand_lift_study?: boolean;
  /** Can use spend cap flag */
  can_use_spend_cap?: boolean;
  /** Whether the campaign was created to be a conversion campaign */
  configured_status?: CampaignStatus;
  /** Creation time */
  created_time?: string;
  /** Daily budget in cents */
  daily_budget?: string;
  /** Effective status */
  effective_status?: string;
  /** Date campaign is scheduled to end */
  end_time?: string;
  /** Has secondary skadnetwork reporting flag */
  has_secondary_skadnetwork_reporting?: boolean;
  /** Is SKAdNetwork attribution enabled */
  is_skadnetwork_attribution?: boolean;
  /** Issues info */
  issues_info?: any[];
  /** Campaign lifetime budget in cents */
  lifetime_budget?: string;
  /** Campaign optimization goal */
  optimization_goal?: string;
  /** Pacing type for the campaign */
  pacing_type?: string[];
  /** The promoted object */
  promoted_object?: {
    pixel_id?: string;
    page_id?: string;
    custom_event_type?: string;
    application_id?: string;
    object_store_url?: string;
    product_set_id?: string;
    product_catalog_id?: string;
    place_page_set_id?: string;
    offer_id?: string;
  };
  /** List of regular categories for ads */
  smart_promotion_type?: string;
  /** The source campaign ID */
  source_campaign_id?: string;
  /** Special ad categories applied to this campaign */
  special_ad_categories?: SpecialAdCategory[];
  /** Special ad category country */
  special_ad_category_country?: string[];
  /** Campaign spend cap in cents */
  spend_cap?: string;
  /** Campaign start time */
  start_time?: string;
  /** Campaign status */
  stop_time?: string;
  /** Topline ID associated with campaign */
  topline_id?: string;
  /** Last update time */
  updated_time?: string;
  /** Allow additional keys */
  [key: string]: any;
}

export interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  daily_budget?: string;
  lifetime_budget?: string;
  bid_amount?: string;
  bid_strategy?: string;
  billing_event?: string;
  optimization_goal?: string;
  pacing_type?: string[];
  start_time?: string;
  end_time?: string;
  targeting?: Record<string, any>;
  status: string;
  promoted_object?: Record<string, any>;
  attribution_spec?: Record<string, any>[];
  adlabels?: Record<string, any>[];
  execution_options?: string[];
  destination_type?: string;
  use_average_cost?: boolean;
  ad_schedules?: Record<string, any>[];
  [key: string]: any;
}

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  campaign_id?: string;
  creative?: Record<string, any>;
  status: string;
  effective_status?: string;
  configured_status?: string;
  tracking_specs?: Record<string, any>[];
  adlabels?: AdLabel[];
  bid_amount?: string;
  conversion_domain?: string;
  createdTime?: string;
  updatedTime?: string;
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