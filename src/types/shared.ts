/**
 * @fileoverview Shared types for Facebook Marketing API
 * These types are used across both tool definitions and operations
 */

import { z } from 'zod';
import { CampaignSchema, AdSetSchema, AdSchema, AdCreativeSchema } from '../schemas/validation';

// Extract TypeScript types from Zod schemas
export type CampaignConfig = z.infer<typeof CampaignSchema>;
export type AdSetConfig = z.infer<typeof AdSetSchema>;
export type AdConfig = z.infer<typeof AdSchema>;
export type AdCreativeConfig = z.infer<typeof AdCreativeSchema>;

// Shared enums
export enum CampaignStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  DELETED = "DELETED",
  ARCHIVED = "ARCHIVED"
}

export enum CampaignObjective {
  APP_INSTALLS = "APP_INSTALLS",
  BRAND_AWARENESS = "BRAND_AWARENESS",
  CONVERSIONS = "CONVERSIONS",
  EVENT_RESPONSES = "EVENT_RESPONSES",
  LEAD_GENERATION = "LEAD_GENERATION",
  LINK_CLICKS = "LINK_CLICKS",
  LOCAL_AWARENESS = "LOCAL_AWARENESS",
  MESSAGES = "MESSAGES",
  OUTCOME_AWARENESS = "OUTCOME_AWARENESS",
  OUTCOME_ENGAGEMENT = "OUTCOME_ENGAGEMENT",
  OUTCOME_LEADS = "OUTCOME_LEADS",
  OUTCOME_SALES = "OUTCOME_SALES",
  OUTCOME_TRAFFIC = "OUTCOME_TRAFFIC",
  OUTCOME_APP_PROMOTION = "OUTCOME_APP_PROMOTION",
  PAGE_LIKES = "PAGE_LIKES",
  POST_ENGAGEMENT = "POST_ENGAGEMENT",
  REACH = "REACH",
  STORE_VISITS = "STORE_VISITS",
  VIDEO_VIEWS = "VIDEO_VIEWS"
}

export enum BidStrategy {
  LOWEST_COST_WITHOUT_CAP = "LOWEST_COST_WITHOUT_CAP",
  LOWEST_COST_WITH_BID_CAP = "LOWEST_COST_WITH_BID_CAP",
  COST_CAP = "COST_CAP",
  LOWEST_COST_WITH_MIN_ROAS = "LOWEST_COST_WITH_MIN_ROAS"
}

export enum BillingEvent {
  APP_INSTALLS = "APP_INSTALLS",
  CLICKS = "CLICKS",
  IMPRESSIONS = "IMPRESSIONS",
  LINK_CLICKS = "LINK_CLICKS",
  NONE = "NONE",
  OFFER_CLAIMS = "OFFER_CLAIMS",
  PAGE_LIKES = "PAGE_LIKES",
  POST_ENGAGEMENT = "POST_ENGAGEMENT",
  THRUPLAY = "THRUPLAY",
  PURCHASES = "PURCHASES"
}

export enum OptimizationGoal {
  NONE = "NONE",
  APP_INSTALLS = "APP_INSTALLS",
  BRAND_AWARENESS = "BRAND_AWARENESS",
  AD_RECALL_LIFT = "AD_RECALL_LIFT",
  CLICKS = "CLICKS",
  ENGAGED_USERS = "ENGAGED_USERS",
  EVENT_RESPONSES = "EVENT_RESPONSES",
  IMPRESSIONS = "IMPRESSIONS",
  LEAD_GENERATION = "LEAD_GENERATION",
  QUALITY_LEAD = "QUALITY_LEAD",
  LINK_CLICKS = "LINK_CLICKS",
  OFFER_CLAIMS = "OFFER_CLAIMS",
  OFFSITE_CONVERSIONS = "OFFSITE_CONVERSIONS",
  PAGE_ENGAGEMENT = "PAGE_ENGAGEMENT",
  PAGE_LIKES = "PAGE_LIKES",
  POST_ENGAGEMENT = "POST_ENGAGEMENT",
  QUALITY_CALL = "QUALITY_CALL",
  REACH = "REACH",
  SOCIAL_IMPRESSIONS = "SOCIAL_IMPRESSIONS",
  APP_DOWNLOADS = "APP_DOWNLOADS",
  TWO_SECOND_CONTINUOUS_VIDEO_VIEWS = "TWO_SECOND_CONTINUOUS_VIDEO_VIEWS",
  LANDING_PAGE_VIEWS = "LANDING_PAGE_VIEWS",
  VALUE = "VALUE",
  THRUPLAY = "THRUPLAY",
  REPLIES = "REPLIES",
  DERIVED_EVENTS = "DERIVED_EVENTS",
  MESSAGES = "MESSAGES"
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  id: string;
  data?: T;
}

export type CampaignResponse = ApiResponse<Campaign>;
export type AdSetResponse = ApiResponse<AdSet>;
export type AdResponse = ApiResponse<Ad>;

// Entity types as they are returned from the API
export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: CampaignStatus;
  created_time: string;
  start_time?: string;
  stop_time?: string;
  spend_cap?: number;
  special_ad_categories?: string[];
  daily_budget?: number;
  lifetime_budget?: number;
  bid_strategy?: string;
  boosted_object_id?: string;
  buying_type?: string;
  promoted_object?: any;
  budget_remaining?: number;
  effective_status?: string;
  account_id?: string;
  adlabels?: Array<{name: string}>;
  is_skadnetwork_attribution?: boolean;
  updated_time?: string;
  configured_status?: string;
}

export interface AdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: CampaignStatus;
  created_time: string;
  start_time?: string;
  end_time?: string;
  daily_budget?: number;
  lifetime_budget?: number;
  budget_remaining?: number;
  targeting?: any;
  bid_amount?: number;
  bid_strategy?: string;
  billing_event?: string;
  optimization_goal?: string;
  attribution_spec?: any[];
  destination_type?: string;
  effective_status?: string;
  promoted_object?: any;
  pacing_type?: string[];
  use_new_app_click?: boolean;
  source_adset_id?: string;
  adlabels?: Array<{name: string}>;
  attribution_windows?: any[];
  adset_schedule?: any[];
  updated_time?: string;
}

export interface Ad {
  id: string;
  name: string;
  adset_id: string;
  campaign_id: string;
  status: CampaignStatus;
  created_time: string;
  updated_time?: string;
  creative?: any;
  targeting?: any;
  bid_amount?: number;
  configured_status?: string;
  effective_status?: string;
  tracking_specs?: any[];
  conversion_specs?: any[];
  adlabels?: Array<{name: string}>;
  recommendations?: any[];
  source_ad_id?: string;
  ad_review_feedback?: any;
}

// Facebook configuration type
export interface FacebookConfig {
  accessToken: string;
  adAccountId: string;
  appId?: string;
  appSecret?: string;
} 