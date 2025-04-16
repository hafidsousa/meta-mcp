/**
 * @fileoverview Campaign operations for Facebook Marketing API
 * 
 * @note IMPORTANT: This is a pure pass-through proxy. All requests and responses
 * are passed directly to and from the Facebook API without modification.
 * All request payloads must use Facebook API's required formats (snake_case).
 */

import { apiRequest } from '../utils/api';

/**
 * Creates a new campaign with specified configuration
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param config Campaign configuration object
 * @returns Promise with campaign creation response
 */
export async function createCampaign(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  config: any
): Promise<any> {
  try {
    // Pass parameters directly to Facebook API
    const response = await apiRequest(
      baseUrl,
      `act_${adAccountId}/campaigns`,
      accessToken,
      'POST',
      config
    );

    // Get the created campaign
    const campaign = await apiRequest(
      baseUrl,
      `${response.id}`,
      accessToken,
      'GET',
      { 
        fields: 'id,name,objective,status,created_time,start_time,stop_time,spend_cap,special_ad_categories,' +
               'special_ad_category_country,daily_budget,lifetime_budget,bid_strategy,boosted_object_id,buying_type,promoted_object,' +
               'budget_remaining,effective_status,account_id,adlabels,is_skadnetwork_attribution,' +
               'source_campaign_id,topline_id'
      }
    );

    return {
      success: true,
      id: response.id,
      data: campaign
    };
  } catch (error) {
    // Pass error directly
    throw error;
  }
}

/**
 * Pauses an active campaign
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param campaignId ID of campaign to pause
 * @returns Promise indicating success/failure
 */
export async function pauseCampaign(
  baseUrl: string,
  accessToken: string,
  campaignId: string
): Promise<boolean> {
  try {
    await apiRequest(
      baseUrl,
      campaignId,
      accessToken,
      'POST',
      { status: 'PAUSED' }
    );
    return true;
  } catch (error) {
    console.error('Error pausing campaign:', error);
    return false;
  }
}

/**
 * Retrieves a specific campaign by ID with all available fields
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param campaignId The ID of the campaign to retrieve
 * @returns Promise with campaign data
 */
export async function getCampaign(
  baseUrl: string,
  accessToken: string,
  campaignId: string
): Promise<any> {
  // Comprehensive list of fields based on Facebook Marketing API documentation
  const fields = [
    'id', 'name', 'objective', 'status', 'created_time', 'start_time', 'stop_time',
    'spend_cap', 'special_ad_categories', 'daily_budget', 'lifetime_budget',
    'bid_strategy', 'boosted_object_id', 'buying_type', 'promoted_object',
    'budget_remaining', 'effective_status', 'account_id', 'adlabels',
    'is_skadnetwork_attribution', 'updated_time', 'configured_status',
    'can_use_spend_cap', 'can_create_brand_lift_study', 'source_campaign_id',
    'special_ad_category_country', 'smart_promotion_type', 'topline_id',
    'pacing_type', 'budget_rebalance_flag', 'optimization_goal'
  ].join(',');

  return await apiRequest(
    baseUrl,
    campaignId,
    accessToken,
    'GET',
    { fields }
  );
}

/**
 * Retrieves all campaigns for the ad account with full details
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param limit Optional limit on number of campaigns to return
 * @param status Optional status filter (ACTIVE, PAUSED, etc.)
 * @param datePreset Optional predefined date range
 * @param timeRange Optional custom date range object {since, until}
 * @returns Promise with array of campaigns
 */
export async function getCampaigns(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  limit?: number,
  status?: string,
  datePreset?: string,
  timeRange?: { since: string; until: string }
): Promise<any[]> {
  // Build parameter object
  const params: Record<string, any> = {
    fields: [
      'id', 'name', 'objective', 'status', 'created_time', 'start_time', 'stop_time',
      'spend_cap', 'special_ad_categories', 'daily_budget', 'lifetime_budget',
      'bid_strategy', 'boosted_object_id', 'buying_type', 'promoted_object',
      'budget_remaining', 'effective_status', 'account_id'
    ].join(',')
  };

  // Add optional parameters
  if (limit) {
    params.limit = limit;
  }

  if (status) {
    params.effective_status = [status];
  }

  if (datePreset) {
    params.date_preset = datePreset;
  }

  if (timeRange) {
    params.time_range = {
      'since': timeRange.since,
      'until': timeRange.until
    };
  }

  const response = await apiRequest(
    baseUrl,
    `act_${adAccountId}/campaigns`,
    accessToken,
    'GET',
    params
  );

  return response.data || [];
}

/**
 * Updates an existing campaign with new configuration
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param campaignId The ID of the campaign to update
 * @param config Campaign configuration object with fields to update
 * @returns Promise with updated campaign data
 */
export async function updateCampaign(
  baseUrl: string,
  accessToken: string,
  campaignId: string,
  config: any
): Promise<any> {
  try {
    // Pass config directly to API
    await apiRequest(
      baseUrl,
      campaignId,
      accessToken,
      'POST',
      config
    );

    // Get updated campaign
    const campaign = await getCampaign(baseUrl, accessToken, campaignId);

    return {
      success: true,
      id: campaignId,
      data: campaign
    };
  } catch (error) {
    // Pass error directly
    throw error;
  }
} 