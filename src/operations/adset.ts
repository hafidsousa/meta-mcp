/**
 * @fileoverview Ad Set operations for Facebook Marketing API
 */

import { AdSet, AdSetConfig, AdSetResponse } from '../types';
import { apiRequest, handleApiError } from '../utils/api';
import { mergeConfig } from '../config';
import { DEFAULT_ADSET_CONFIG } from '../config';

/**
 * Creates a new ad set within a campaign
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param config Ad set configuration object
 * @returns Promise with ad set creation response
 */
export async function createAdSet(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  config: Partial<AdSetConfig>
): Promise<AdSetResponse> {
  try {
    const finalConfig = mergeConfig(DEFAULT_ADSET_CONFIG, config);
    
    // Convert to snake_case for API
    const params: Record<string, any> = {
      name: finalConfig.name,
      campaign_id: finalConfig.campaignId,
      status: finalConfig.status || 'PAUSED',
      targeting: finalConfig.targeting,
      optimization_goal: finalConfig.optimizationGoal,
      billing_event: finalConfig.billingEvent
    };

    // Add budget parameters
    if (finalConfig.dailyBudget) {
      params.daily_budget = finalConfig.dailyBudget;
    }
    
    if (finalConfig.lifetimeBudget) {
      params.lifetime_budget = finalConfig.lifetimeBudget;
    }
    
    // Add schedule parameters
    if (finalConfig.startTime) {
      params.start_time = finalConfig.startTime;
    }
    
    if (finalConfig.endTime) {
      params.end_time = finalConfig.endTime;
    }
    
    // Add bidding parameters
    if (finalConfig.bidAmount) {
      params.bid_amount = finalConfig.bidAmount;
    }
    
    if (finalConfig.bidStrategy) {
      params.bid_strategy = finalConfig.bidStrategy;
    }
    
    // Add promoted object if specified
    if (finalConfig.promotedObject) {
      // Convert camelCase keys to snake_case
      const promotedObject: Record<string, any> = {};
      Object.entries(finalConfig.promotedObject).forEach(([key, value]) => {
        // Convert pageId to page_id, etc.
        const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        promotedObject[snakeCaseKey] = value;
      });
      params.promoted_object = promotedObject;
    }
    
    // Add time-based scheduling
    if (finalConfig.adSchedules && finalConfig.adSchedules.length > 0) {
      params.ad_schedules = finalConfig.adSchedules;
    }
    
    // Add attribution specs
    if (finalConfig.attributionSpec) {
      params.attribution_spec = finalConfig.attributionSpec;
    }
    
    // Add pacing type
    if (finalConfig.pacingType) {
      params.pacing_type = finalConfig.pacingType;
    }
    
    // Add use average cost
    if (finalConfig.useAverageCost !== undefined) {
      params.use_average_cost = finalConfig.useAverageCost;
    }

    const response = await apiRequest<{id: string}>(
      baseUrl,
      `act_${adAccountId}/adsets`,
      accessToken,
      'POST',
      params
    );

    // Fetch the complete ad set data
    const adSet = await apiRequest<AdSet>(
      baseUrl,
      `${response.id}`,
      accessToken,
      'GET',
      { fields: 'id,name,campaign_id,daily_budget,lifetime_budget,bid_amount,bid_strategy,start_time,end_time,targeting,optimization_goal,billing_event,status,promoted_object' }
    );

    return {
      id: response.id,
      success: true,
      data: adSet
    };
  } catch (error) {
    handleApiError(error, 'create ad set');
  }
}

/**
 * Gets all ad sets for a campaign
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param campaignId ID of the campaign
 * @returns Promise with list of ad sets
 */
export async function getAdSets(
  baseUrl: string,
  accessToken: string,
  campaignId: string
): Promise<AdSet[]> {
  try {
    const fields = 'id,name,campaign_id,daily_budget,lifetime_budget,targeting,status';
    
    const response = await apiRequest<{data: AdSet[]}>(
      baseUrl,
      `${campaignId}/adsets`,
      accessToken,
      'GET',
      { fields }
    );
    
    return response.data || [];
  } catch (error) {
    console.error('Error getting ad sets:', error);
    return [];
  }
}

/**
 * Pauses an active ad set
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adSetId ID of ad set to pause
 * @returns Promise indicating success/failure
 */
export async function pauseAdSet(
  baseUrl: string,
  accessToken: string,
  adSetId: string
): Promise<boolean> {
  try {
    await apiRequest(
      baseUrl,
      adSetId,
      accessToken,
      'POST',
      { status: 'PAUSED' }
    );
    return true;
  } catch (error) {
    console.error('Error pausing ad set:', error);
    return false;
  }
}

/**
 * Retrieves a specific ad set by ID with all available fields
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adSetId The ID of the ad set to retrieve
 * @returns Promise with ad set data
 */
export async function getAdSet(
  baseUrl: string,
  accessToken: string,
  adSetId: string
): Promise<AdSet> {
  try {
    const fields = [
      'id', 'name', 'campaign_id', 'daily_budget', 'lifetime_budget',
      'bid_amount', 'bid_strategy', 'billing_event', 'optimization_goal',
      'targeting', 'status', 'start_time', 'end_time', 'created_time',
      'updated_time', 'promoted_object', 'attribution_spec', 'use_average_cost',
      'pacing_type', 'budget_remaining', 'effective_status', 'adlabels',
      'destination_type', 'execution_options', 'configured_status'
    ].join(',');

    return await apiRequest<AdSet>(
      baseUrl,
      adSetId,
      accessToken,
      'GET',
      { fields }
    );
  } catch (error) {
    handleApiError(error, `get ad set ${adSetId}`);
  }
}

/**
 * Retrieves all ad sets for the ad account with full details
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param limit Optional limit on number of ad sets to return
 * @param status Optional status filter (ACTIVE, PAUSED, etc.)
 * @returns Promise with array of ad sets
 */
export async function getAccountAdSets(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  limit?: number,
  status?: string
): Promise<AdSet[]> {
  try {
    const params: Record<string, any> = {
      fields: [
        'id', 'name', 'campaign_id', 'daily_budget', 'lifetime_budget',
        'bid_amount', 'bid_strategy', 'billing_event', 'optimization_goal',
        'targeting', 'status', 'start_time', 'end_time', 'created_time',
        'updated_time', 'promoted_object', 'attribution_spec', 'use_average_cost',
        'pacing_type', 'budget_remaining', 'effective_status'
      ].join(',')
    };

    // Add optional parameters
    if (limit) {
      params.limit = limit;
    }

    if (status) {
      params.effective_status = [status];
    }

    const response = await apiRequest<{data: AdSet[]}>(
      baseUrl,
      `act_${adAccountId}/adsets`,
      accessToken,
      'GET',
      params
    );
    
    return response.data || [];
  } catch (error) {
    handleApiError(error, 'get account ad sets');
  }
}

/**
 * Updates an existing ad set with new configuration settings
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adSetId The ID of the ad set to update
 * @param config Ad set configuration with updated fields
 * @returns Promise with update response
 */
export async function updateAdSet(
  baseUrl: string,
  accessToken: string,
  adSetId: string,
  config: Partial<AdSetConfig>
): Promise<AdSetResponse> {
  try {
    // Prepare update parameters for Facebook API
    const params: Record<string, any> = {};
    
    // Add name if provided
    if (config.name) {
      params.name = config.name;
    }
    
    // Add status if provided
    if (config.status) {
      params.status = config.status;
    }
    
    // Add daily or lifetime budget
    if (config.dailyBudget) {
      params.daily_budget = config.dailyBudget;
    }
    
    if (config.lifetimeBudget) {
      params.lifetime_budget = config.lifetimeBudget;
    }
    
    // Add schedule parameters
    if (config.startTime) {
      params.start_time = config.startTime;
    }
    
    if (config.endTime) {
      params.end_time = config.endTime;
    }
    
    // Add bidding parameters
    if (config.bidAmount) {
      params.bid_amount = config.bidAmount;
    }
    
    if (config.bidStrategy) {
      params.bid_strategy = config.bidStrategy;
    }
    
    // Add targeting if provided
    if (config.targeting) {
      params.targeting = config.targeting;
    }
    
    // Add optimization goal if provided
    if (config.optimizationGoal) {
      params.optimization_goal = config.optimizationGoal;
    }
    
    // Add billing event if provided
    if (config.billingEvent) {
      params.billing_event = config.billingEvent;
    }
    
    // Add promoted object if specified
    if (config.promotedObject) {
      // Convert camelCase keys to snake_case
      const promotedObject: Record<string, any> = {};
      Object.entries(config.promotedObject).forEach(([key, value]) => {
        const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        promotedObject[snakeCaseKey] = value;
      });
      params.promoted_object = promotedObject;
    }
    
    // Add destination type if provided
    if (config.destinationType) {
      params.destination_type = config.destinationType;
    }
    
    // Add time-based scheduling
    if (config.adSchedules && config.adSchedules.length > 0) {
      params.ad_schedules = config.adSchedules;
    }
    
    // Add attribution specs
    if (config.attributionSpec) {
      params.attribution_spec = config.attributionSpec;
    }
    
    // Add pacing type
    if (config.pacingType) {
      params.pacing_type = config.pacingType;
    }
    
    // Add use average cost
    if (config.useAverageCost !== undefined) {
      params.use_average_cost = config.useAverageCost;
    }
    
    // Make the API request to update the ad set
    const response = await apiRequest<{success: boolean}>(
      baseUrl,
      adSetId,
      accessToken,
      'POST',
      params
    );
    
    // Fetch the updated ad set data
    const updatedAdSet = await getAdSet(baseUrl, accessToken, adSetId);
    
    return {
      id: adSetId,
      success: response.success || true,
      data: updatedAdSet
    };
  } catch (error) {
    handleApiError(error, `update ad set ${adSetId}`);
  }
} 