/**
 * @fileoverview Facebook Marketing API field definitions
 * 
 * This file centralizes all field definitions for Facebook API entities.
 * When Facebook updates their API, only this file needs to be updated.
 */

/**
 * Campaign fields for Facebook API requests
 */
export const CAMPAIGN_FIELDS = [
  'id', 'name', 'objective', 'status', 'created_time', 'start_time', 'stop_time',
  'spend_cap', 'special_ad_categories', 'daily_budget', 'lifetime_budget',
  'bid_strategy', 'boosted_object_id', 'buying_type', 'promoted_object',
  'budget_remaining', 'effective_status', 'account_id', 'adlabels',
  'is_skadnetwork_attribution', 'updated_time', 'configured_status',
  'can_use_spend_cap', 'can_create_brand_lift_study', 'source_campaign_id',
  'special_ad_category_country', 'smart_promotion_type', 'topline_id',
  'pacing_type', 'budget_rebalance_flag', 'optimization_goal'
];

/**
 * Ad Set fields for Facebook API requests
 */
export const ADSET_FIELDS = [
  'id', 'name', 'campaign_id', 'status', 'created_time', 'start_time', 'end_time',
  'daily_budget', 'lifetime_budget', 'budget_remaining', 'targeting', 
  'bid_amount', 'bid_strategy', 'billing_event', 'optimization_goal',
  'attribution_spec', 'destination_type', 'effective_status', 'promoted_object',
  'pacing_type', 'use_new_app_click', 'source_adset_id', 'adlabels',
  'attribution_windows', 'adset_schedule', 'updated_time'
];

/**
 * Ad fields for Facebook API requests
 */
export const AD_FIELDS = [
  'id', 'name', 'adset_id', 'campaign_id', 'status', 'created_time',
  'updated_time', 'creative', 'targeting', 'bid_amount', 'configured_status',
  'effective_status', 'tracking_specs', 'conversion_specs', 'adlabels',
  'recommendations', 'source_ad_id', 'ad_review_feedback'
];

/**
 * Ad Creative fields for Facebook API requests
 */
export const CREATIVE_FIELDS = [
  'id', 'name', 'title', 'body', 'image_url', 'image_hash', 'link_url',
  'object_story_id', 'object_story_spec', 'object_type', 'url_tags',
  'video_id', 'call_to_action_type', 'link_og_id', 'actor_id', 'adlabels',
  'branded_content_sponsor_page_id', 'instagram_actor_id', 'instagram_permalink_url',
  'asset_feed_spec'
];

/**
 * Ad Account fields for Facebook API requests
 */
export const ACCOUNT_FIELDS = [
  'id', 'name', 'account_id', 'account_status', 'age', 'capabilities',
  'created_time', 'currency', 'timezone_id', 'timezone_name', 'timezone_offset_hours_utc',
  'amount_spent', 'balance', 'business', 'business_city', 'business_country_code',
  'business_name', 'business_state', 'business_street', 'business_street2'
]; 