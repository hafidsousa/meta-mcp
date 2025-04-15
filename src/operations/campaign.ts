/**
 * @fileoverview Campaign operations for Facebook Marketing API
 * 
 * @note IMPORTANT: All fields in request payloads must be in camelCase format.
 * The API client will convert them to snake_case as needed for the Facebook API.
 */

import { Campaign, CampaignConfig, CampaignResponse, CampaignStatus } from '../types';
import { apiRequest, handleApiError } from '../utils/api';
import { FacebookMarketingError, ErrorCodes } from '../errors';
import * as humps from 'humps';

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
  config: CampaignConfig
): Promise<CampaignResponse> {
  try {
    // Validate required campaign fields
    if (!config.name?.trim()) {
      throw new FacebookMarketingError(
        'Campaign name is required',
        ErrorCodes.VALIDATION_ERROR
      );
    }

    if (!config.objective) {
      throw new FacebookMarketingError(
        'Campaign objective is required',
        ErrorCodes.VALIDATION_ERROR
      );
    }

    // Convert camelCase to snake_case for API params using humps
    const params = humps.decamelizeKeys({
      name: config.name,
      objective: config.objective,
      status: config.status,
      specialAdCategories: config.specialAdCategories || [],
      spendCap: config.spendCap,
      bidStrategy: config.bidStrategy,
      dailyBudget: config.dailyBudget,
      lifetimeBudget: config.lifetimeBudget,
      campaignBudgetOptimization: config.campaignBudgetOptimization,
      minRoasTargetValue: config.minRoasTargetValue,
      adLabels: config.adLabels,
      startTime: config.startTime,
      stopTime: config.stopTime,
      boostedObjectId: config.boostedObjectId,
      promotedObject: config.promotedObject,
      isSkadnetworkAttribution: config.isSkadnetworkAttribution
    });
    
    const response = await apiRequest<{id: string}>(
      baseUrl,
      `act_${adAccountId}/campaigns`,
      accessToken,
      'POST',
      params
    );

    // Get the created campaign
    const campaign = await apiRequest<Campaign>(
      baseUrl,
      `${response.id}`,
      accessToken,
      'GET',
      { 
        fields: 'id,name,objective,status,created_time,start_time,stop_time,spend_cap,special_ad_categories,' +
               'daily_budget,lifetime_budget,bid_strategy,boosted_object_id,buying_type,promoted_object,' +
               'budget_remaining,effective_status,account_id,adlabels,is_skadnetwork_attribution'
      }
    );

    return {
      success: true,
      id: response.id,
      data: campaign
    };
  } catch (error) {
    handleApiError(error, 'create campaign');
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
): Promise<Campaign> {
  try {
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

    return await apiRequest<Campaign>(
      baseUrl,
      campaignId,
      accessToken,
      'GET',
      { fields }
    );
  } catch (error) {
    handleApiError(error, `get campaign ${campaignId}`);
  }
}

/**
 * Retrieves all campaigns for the ad account with full details
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param limit Optional limit on number of campaigns to return
 * @param status Optional status filter (ACTIVE, PAUSED, etc.)
 * @returns Promise with array of campaigns
 */
export async function getCampaigns(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  limit?: number,
  status?: CampaignStatus
): Promise<Campaign[]> {
  try {
    const params: Record<string, any> = {
      // Comprehensive list of fields based on Facebook Marketing API documentation
      fields: [
        'id', 'name', 'objective', 'status', 'created_time', 'start_time', 'stop_time',
        'spend_cap', 'special_ad_categories', 'daily_budget', 'lifetime_budget',
        'bid_strategy', 'boosted_object_id', 'buying_type', 'promoted_object',
        'budget_remaining', 'effective_status', 'account_id', 'adlabels',
        'is_skadnetwork_attribution', 'updated_time'
      ].join(',')
    };

    // Add optional parameters
    if (limit) {
      params.limit = limit;
    }

    if (status) {
      params.effective_status = [status];
    }

    const response = await apiRequest<{data: Campaign[]}>(
      baseUrl,
      `act_${adAccountId}/campaigns`,
      accessToken,
      'GET',
      params
    );
    
    return response.data || [];
  } catch (error) {
    handleApiError(error, 'get campaigns');
  }
}

/**
 * Updates an existing campaign with new configuration settings
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
  config: Partial<CampaignConfig>
): Promise<CampaignResponse> {
  try {
    // Convert camelCase to snake_case for API params using humps
    const params = humps.decamelizeKeys({
      name: config.name,
      status: config.status,
      objective: config.objective,
      specialAdCategories: config.specialAdCategories,
      spendCap: config.spendCap,
      bidStrategy: config.bidStrategy,
      dailyBudget: config.dailyBudget,
      lifetimeBudget: config.lifetimeBudget,
      campaignBudgetOptimization: config.campaignBudgetOptimization,
      minRoasTargetValue: config.minRoasTargetValue,
      adLabels: config.adLabels,
      startTime: config.startTime,
      stopTime: config.stopTime,
      boostedObjectId: config.boostedObjectId,
      promotedObject: config.promotedObject,
      isSkadnetworkAttribution: config.isSkadnetworkAttribution,
      useDefaultBuyingType: config.useDefaultBuyingType
    });
    
    // Make API request to update campaign
    const response = await apiRequest<{ success: boolean }>(
      baseUrl,
      campaignId,
      accessToken,
      'POST',
      params
    );
    
    // Get the updated campaign data
    const campaign = await getCampaign(baseUrl, accessToken, campaignId);
    
    return {
      success: response.success || true,
      id: campaignId,
      data: campaign
    };
  } catch (error) {
    handleApiError(error, `update campaign ${campaignId}`);
    throw error;
  }
} 