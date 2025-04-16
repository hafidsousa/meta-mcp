/**
 * @fileoverview Ad operations for Facebook Marketing API
 * 
 * @note IMPORTANT: This is a pure pass-through proxy. All requests and responses
 * are passed directly to and from the Facebook API without modification.
 * All request payloads must use Facebook API's required formats (snake_case).
 */

import { apiRequest } from '../utils/api';

/**
 * Creates a new ad
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param config Ad configuration
 * @returns Promise with ad creation response
 */
export async function createAd(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  config: any
): Promise<any> {
  try {
    // Pass parameters directly to Facebook API
    const response = await apiRequest(
      baseUrl,
      `act_${adAccountId}/ads`,
      accessToken,
      'POST',
      config
    );

    // Get the created ad
    const ad = await apiRequest(
      baseUrl,
      `${response.id}`,
      accessToken,
      'GET',
      { 
        fields: 'id,name,adset_id,creative,status,effective_status,configured_status,tracking_specs,adlabels,bid_amount,conversion_domain'
      }
    );

    return {
      success: true,
      id: response.id,
      data: ad
    };
  } catch (error) {
    // Pass error directly
    throw error;
  }
}

/**
 * Pauses an active ad
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adId ID of ad to pause
 * @returns Promise indicating success/failure
 */
export async function pauseAd(
  baseUrl: string,
  accessToken: string,
  adId: string
): Promise<boolean> {
  try {
    await apiRequest(
      baseUrl,
      adId,
      accessToken,
      'POST',
      { status: 'PAUSED' }
    );
    return true;
  } catch (error) {
    console.error('Error pausing ad:', error);
    return false;
  }
}

/**
 * Retrieves ads for an ad set
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adSetId Ad set ID
 * @returns Promise with array of ads
 */
export async function getAds(
  baseUrl: string,
  accessToken: string,
  adSetId: string
): Promise<any[]> {
  const params = {
    adset_id: adSetId,
    fields: [
      'id', 'name', 'adset_id', 'creative', 'status', 
      'effective_status', 'configured_status', 'tracking_specs',
      'adlabels', 'bid_amount', 'conversion_domain'
    ].join(',')
  };

  const response = await apiRequest(
    baseUrl,
    'ads',
    accessToken,
    'GET',
    params
  );

  return response.data || [];
}

/**
 * Gets ads for an ad account
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param limit Optional maximum number of ads to return
 * @param status Optional status filter
 * @returns Promise with array of ads
 */
export async function getAccountAds(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  limit?: number,
  status?: string
): Promise<any[]> {
  const params: Record<string, any> = {
    fields: [
      'id', 'name', 'adset_id', 'creative', 'status', 
      'effective_status', 'configured_status', 'tracking_specs',
      'adlabels', 'bid_amount', 'conversion_domain'
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
    `act_${adAccountId}/ads`,
    accessToken,
    'GET',
    params
  );

  return response.data || [];
}

/**
 * Retrieves a specific ad by ID
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adId The ID of the ad to retrieve
 * @returns Promise with ad data
 */
export async function getAd(
  baseUrl: string,
  accessToken: string,
  adId: string
): Promise<any> {
  const fields = [
    'id', 'name', 'adset_id', 'campaign_id', 'creative', 'status', 
    'effective_status', 'configured_status', 'tracking_specs',
    'adlabels', 'bid_amount', 'conversion_domain', 'created_time',
    'updated_time'
  ].join(',');

  return await apiRequest(
    baseUrl,
    adId,
    accessToken,
    'GET',
    { fields }
  );
}

/**
 * Updates an existing ad
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adId ID of the ad to update
 * @param config Ad configuration with fields to update
 * @returns Promise with updated ad data
 */
export async function updateAd(
  baseUrl: string,
  accessToken: string,
  adId: string,
  config: any
): Promise<any> {
  try {
    // Pass config directly to API
    await apiRequest(
      baseUrl,
      adId,
      accessToken,
      'POST',
      config
    );

    // Get updated ad
    const ad = await getAd(baseUrl, accessToken, adId);

    return {
      success: true,
      id: adId,
      data: ad
    };
  } catch (error) {
    // Pass error directly
    throw error;
  }
} 