/**
 * @fileoverview Ad Set operations for Facebook Marketing API
 * 
 * @note IMPORTANT: This is a pure pass-through proxy. All requests and responses
 * are passed directly to and from the Facebook API without modification.
 * All request payloads must use Facebook API's required formats (snake_case).
 */

import { apiRequest } from '../utils/api';

/**
 * Creates an ad set
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param config Ad set configuration
 * @returns Promise with ad set creation response
 */
export async function createAdSet(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  config: any
): Promise<any> {
  try {
    // Pass parameters directly to Facebook API
    const response = await apiRequest(
      baseUrl,
      `act_${adAccountId}/adsets`,
      accessToken,
      'POST',
      config
    );

    // Get the created ad set
    const adSet = await apiRequest(
      baseUrl,
      `${response.id}`,
      accessToken,
      'GET',
      { 
        fields: 'id,name,campaign_id,daily_budget,lifetime_budget,bid_amount,bid_strategy,billing_event,' +
                'optimization_goal,targeting,status,promoted_object,start_time,end_time,attribution_spec,' +
                'adlabels,execution_options,destination_type,use_average_cost'
      }
    );

    return {
      success: true,
      id: response.id,
      data: adSet
    };
  } catch (error) {
    // Pass error directly
    throw error;
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
 * Retrieves all ad sets for a campaign
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param campaignId Campaign ID to get ad sets for
 * @returns Promise with array of ad sets
 */
export async function getAdSets(
  baseUrl: string,
  accessToken: string,
  campaignId: string
): Promise<any[]> {
  const params = {
    campaign_id: campaignId,
    fields: [
      'id', 'name', 'campaign_id', 'daily_budget', 'lifetime_budget', 
      'bid_amount', 'bid_strategy', 'billing_event', 'optimization_goal',
      'targeting', 'status', 'promoted_object', 'start_time', 'end_time',
      'attribution_spec', 'adlabels', 'execution_options', 
      'destination_type', 'use_average_cost'
    ].join(',')
  };

  const response = await apiRequest(
    baseUrl,
    'adsets',
    accessToken,
    'GET',
    params
  );

  return response.data || [];
}

/**
 * Gets ad sets for an ad account
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param limit Optional maximum number of ad sets to return
 * @param status Optional status filter
 * @returns Promise with array of ad sets
 */
export async function getAccountAdSets(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  limit?: number,
  status?: string
): Promise<any[]> {
  const params: Record<string, any> = {
    fields: [
      'id', 'name', 'campaign_id', 'daily_budget', 'lifetime_budget', 
      'bid_amount', 'bid_strategy', 'billing_event', 'optimization_goal',
      'targeting', 'status', 'promoted_object', 'start_time', 'end_time'
    ].join(',')
  };

  if (limit) {
    params.limit = limit;
  }

  if (status) {
    params.effective_status = [status];
  }

  const response = await apiRequest(
    baseUrl,
    `act_${adAccountId}/adsets`,
    accessToken,
    'GET',
    params
  );

  return response.data || [];
}

/**
 * Retrieves a specific ad set by ID
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adSetId The ID of the ad set to retrieve
 * @returns Promise with ad set data
 */
export async function getAdSet(
  baseUrl: string,
  accessToken: string,
  adSetId: string
): Promise<any> {
  const fields = [
    'id', 'name', 'campaign_id', 'daily_budget', 'lifetime_budget', 
    'bid_amount', 'bid_strategy', 'billing_event', 'optimization_goal',
    'targeting', 'status', 'promoted_object', 'start_time', 'end_time',
    'attribution_spec', 'adlabels', 'execution_options', 
    'destination_type', 'use_average_cost', 'ad_schedules'
  ].join(',');

  return await apiRequest(
    baseUrl,
    adSetId,
    accessToken,
    'GET',
    { fields }
  );
}

/**
 * Updates an existing ad set
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adSetId ID of the ad set to update
 * @param config Ad set configuration with fields to update
 * @returns Promise with updated ad set data
 */
export async function updateAdSet(
  baseUrl: string,
  accessToken: string,
  adSetId: string,
  config: any
): Promise<any> {
  try {
    // Pass config directly to API
    await apiRequest(
      baseUrl,
      adSetId,
      accessToken,
      'POST',
      config
    );

    // Get updated ad set
    const adSet = await getAdSet(baseUrl, accessToken, adSetId);

    return {
      success: true,
      id: adSetId,
      data: adSet
    };
  } catch (error) {
    // Pass error directly
    throw error;
  }
} 