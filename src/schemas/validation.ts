/**
 * @fileoverview Validation schemas for Facebook Marketing API entities
 * Using Zod for schema validation to replace manual validation
 */

import { z } from 'zod';

/**
 * Campaign configuration schema
 */
export const CampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  objective: z.enum([
    "APP_INSTALLS", "BRAND_AWARENESS", "CONVERSIONS", "EVENT_RESPONSES", 
    "LEAD_GENERATION", "LINK_CLICKS", "LOCAL_AWARENESS", "MESSAGES", 
    "OUTCOME_AWARENESS", "OUTCOME_ENGAGEMENT", "OUTCOME_LEADS",
    "OUTCOME_SALES", "OUTCOME_TRAFFIC", "OUTCOME_APP_PROMOTION",
    "PAGE_LIKES", "POST_ENGAGEMENT", "REACH", "STORE_VISITS", "VIDEO_VIEWS"
  ], {
    errorMap: () => ({ message: "Campaign objective is required and must be valid" })
  }),
  status: z.enum(["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"]).optional().default("PAUSED"),
  specialAdCategories: z.array(
    z.enum(["NONE", "EMPLOYMENT", "HOUSING", "CREDIT", "ISSUES_ELECTIONS_POLITICS"])
  ).optional().default(["NONE"]),
  spendCap: z.number().positive().optional(),
  dailyBudget: z.number().positive().optional(),
  lifetimeBudget: z.number().positive().optional(),
  startTime: z.string().optional(),
  stopTime: z.string().optional(),
  bidStrategy: z.enum([
    "LOWEST_COST_WITHOUT_CAP", 
    "LOWEST_COST_WITH_BID_CAP", 
    "COST_CAP", 
    "LOWEST_COST_WITH_MIN_ROAS"
  ]).optional(),
  campaignBudgetOptimization: z.boolean().optional(),
  minRoasTargetValue: z.number().positive().optional(),
  adLabels: z.array(
    z.object({
      name: z.string()
    })
  ).optional(),
  boostedObjectId: z.string().optional(),
  promotedObject: z.object({
    pageId: z.string().optional(),
    applicationId: z.string().optional(),
    objectStoreUrl: z.string().optional(),
    pixelId: z.string().optional(),
    offerId: z.string().optional()
  }).optional(),
  isSkadnetworkAttribution: z.boolean().optional()
}).refine(data => {
  // If lifetimeBudget is provided, stopTime is required
  if (data.lifetimeBudget && !data.stopTime) {
    return false;
  }
  // Cannot have both dailyBudget and lifetimeBudget
  if (data.dailyBudget && data.lifetimeBudget) {
    return false;
  }
  return true;
}, {
  message: "If lifetimeBudget is provided, stopTime is required. Cannot have both dailyBudget and lifetimeBudget."
});

/**
 * Ad Set configuration schema
 */
export const AdSetSchema = z.object({
  name: z.string().min(1, "Ad set name is required"),
  campaignId: z.string().min(1, "Campaign ID is required"),
  status: z.enum(["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"]).optional().default("PAUSED"),
  dailyBudget: z.number().positive().optional(),
  lifetimeBudget: z.number().positive().optional(),
  bidAmount: z.number().positive().optional(),
  bidStrategy: z.enum([
    "LOWEST_COST_WITHOUT_CAP", 
    "LOWEST_COST_WITH_BID_CAP", 
    "COST_CAP", 
    "LOWEST_COST_WITH_MIN_ROAS"
  ]).optional(),
  billingEvent: z.enum([
    "APP_INSTALLS",
    "CLICKS", 
    "IMPRESSIONS", 
    "LINK_CLICKS", 
    "NONE", 
    "OFFER_CLAIMS", 
    "PAGE_LIKES", 
    "POST_ENGAGEMENT", 
    "THRUPLAY", 
    "PURCHASES"
  ]).optional(),
  optimizationGoal: z.enum([
    "NONE",
    "APP_INSTALLS",
    "BRAND_AWARENESS",
    "AD_RECALL_LIFT",
    "CLICKS",
    "ENGAGED_USERS",
    "EVENT_RESPONSES",
    "IMPRESSIONS",
    "LEAD_GENERATION",
    "QUALITY_LEAD",
    "LINK_CLICKS",
    "OFFER_CLAIMS",
    "OFFSITE_CONVERSIONS",
    "PAGE_ENGAGEMENT",
    "PAGE_LIKES",
    "POST_ENGAGEMENT",
    "QUALITY_CALL",
    "REACH",
    "SOCIAL_IMPRESSIONS",
    "APP_DOWNLOADS",
    "TWO_SECOND_CONTINUOUS_VIDEO_VIEWS",
    "LANDING_PAGE_VIEWS",
    "VALUE",
    "THRUPLAY",
    "REPLIES",
    "DERIVED_EVENTS",
    "MESSAGES"
  ]).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  targeting: z.record(z.string(), z.unknown()).optional(),
  attributionSpec: z.array(z.record(z.string(), z.unknown())).optional(),
  useNewAppClick: z.boolean().optional(),
  adsetSchedule: z.array(z.object({
    daysOfWeek: z.array(z.number().min(1).max(7)),
    startMinute: z.number().min(0).max(1439),
    endMinute: z.number().min(0).max(1439)
  })).optional(),
  promotedObject: z.record(z.string(), z.unknown()).optional()
}).refine(data => {
  // Cannot have both dailyBudget and lifetimeBudget
  if (data.dailyBudget && data.lifetimeBudget) {
    return false;
  }
  // If lifetimeBudget is provided, endTime is required
  if (data.lifetimeBudget && !data.endTime) {
    return false;
  }
  return true;
}, {
  message: "Cannot have both dailyBudget and lifetimeBudget. If lifetimeBudget is provided, endTime is required."
});

/**
 * Ad Creative configuration schema
 */
export const AdCreativeSchema = z.object({
  name: z.string().optional(),
  objectStorySpec: z.object({
    pageId: z.string().optional(),
    linkData: z.object({
      message: z.string().optional(),
      link: z.string().url("Invalid URL format").optional(),
      caption: z.string().optional(),
      description: z.string().optional(),
      imageHash: z.string().optional(),
      callToAction: z.object({
        type: z.string(),
        value: z.record(z.string(), z.unknown()).optional()
      }).optional()
    }).optional(),
    videoData: z.object({
      videoId: z.string(),
      title: z.string().optional(),
      message: z.string().optional(),
      callToAction: z.object({
        type: z.string(),
        value: z.record(z.string(), z.unknown()).optional()
      }).optional()
    }).optional()
  }).optional(),
  objectStoryId: z.string().optional(),
  assetFeedSpec: z.record(z.string(), z.unknown()).optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  imageHash: z.string().optional(),
  linkUrl: z.string().url("Invalid link URL").optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  objectType: z.string().optional(),
  callToActionType: z.string().optional()
}).refine(data => {
  // Must have either objectStorySpec, objectStoryId, or at least imageUrl/linkUrl combination
  return !!(data.objectStorySpec || data.objectStoryId || (data.imageUrl && data.linkUrl));
}, {
  message: "Must provide either objectStorySpec, objectStoryId, or at least imageUrl/linkUrl combination"
});

/**
 * Ad configuration schema
 */
export const AdSchema = z.object({
  name: z.string().min(1, "Ad name is required"),
  adsetId: z.string().min(1, "Ad set ID is required"),
  status: z.enum(["ACTIVE", "PAUSED", "DELETED", "ARCHIVED"]).optional().default("PAUSED"),
  creativeId: z.string().optional(),
  creative: AdCreativeSchema.optional(),
  trackingSpecs: z.array(z.record(z.string(), z.unknown())).optional(),
  adLabels: z.array(z.object({
    name: z.string()
  })).optional(),
  bidAmount: z.number().positive().optional()
}).refine(data => {
  // Must have either creativeId or creative
  return !!(data.creativeId || data.creative);
}, {
  message: "Must provide either creativeId or creative object"
}); 