/**
 * @fileoverview Ad operations for Facebook Marketing API
 * 
 * @note IMPORTANT: All fields in request payloads must be in camelCase format.
 * The API client will convert them to snake_case as needed for the Facebook API.
 */

import { Ad, AdConfig, AdResponse } from '../types';
import { apiRequest, handleApiError } from '../utils/api';
import { DEFAULT_CREATIVE_CONFIG } from '../config';
import * as humps from 'humps';

/**
 * Creates a new ad within an ad set
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param config Ad configuration object
 * @returns Promise with ad creation response
 */
export async function createAd(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  config: AdConfig
): Promise<AdResponse> {
  try {
    // Merge creative config while preserving required fields from user config
    const creative = {
      ...DEFAULT_CREATIVE_CONFIG,
      ...config.creative
    };
    
    // First create the creative - convert camelCase to snake_case using humps
    const creativeParams = humps.decamelizeKeys({
      name: creative.name,
      title: creative.title,
      body: creative.body,
      linkUrl: creative.linkUrl,
      imageUrl: creative.imageUrl,
      callToActionType: creative.callToAction,
      urlTags: creative.urlTags,
      objectStorySpec: creative.objectStorySpec,
      format: creative.format
    });
    
    const creativeResponse = await apiRequest<{id: string}>(
      baseUrl,
      `act_${adAccountId}/adcreatives`,
      accessToken,
      'POST',
      creativeParams
    );
    
    // Then create the ad with the creative - convert camelCase to snake_case using humps
    const adParams = humps.decamelizeKeys({
      name: config.name,
      adsetId: config.adsetId,
      status: config.status,
      creative: { creativeId: creativeResponse.id },
      trackingSpecs: config.trackingSpecs,
      bidAmount: config.bidAmount,
      conversionDomain: config.conversionDomain,
      adlabels: config.adlabels,
      display_sequence: config.display_sequence,
      engagement_audience: config.engagement_audience
    });
    
    const adResponse = await apiRequest<{id: string}>(
      baseUrl,
      `act_${adAccountId}/ads`,
      accessToken,
      'POST',
      adParams
    );
    
    // Fetch complete ad data
    const ad = await apiRequest<Ad>(
      baseUrl,
      `${adResponse.id}`,
      accessToken,
      'GET',
      { fields: 'id,name,adset_id,creative,status,tracking_specs,bid_amount' }
    );

    return {
      id: adResponse.id,
      success: true,
      data: ad
    };
  } catch (error) {
    handleApiError(error, 'create ad');
  }
}

/**
 * Gets all ads for an ad set
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adSetId ID of the ad set
 * @returns Promise with list of ads
 */
export async function getAds(
  baseUrl: string,
  accessToken: string,
  adSetId: string
): Promise<Ad[]> {
  try {
    const fields = 'id,name,adset_id,creative,status';
    
    const response = await apiRequest<{data: Ad[]}>(
      baseUrl,
      `${adSetId}/ads`,
      accessToken,
      'GET',
      { fields }
    );
    
    return response.data || [];
  } catch (error) {
    console.error('Error getting ads:', error);
    return [];
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
 * Gets all ads for the ad account
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param limit Optional limit on number of ads to return
 * @param status Optional status filter (ACTIVE, PAUSED, etc.)
 * @returns Promise with array of ads
 */
export async function getAccountAds(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  limit?: number,
  status?: string
): Promise<Ad[]> {
  try {
    const adAccountIdClean = adAccountId.replace('act_', '');
    const path = `act_${adAccountIdClean}/ads`;
    
    // Using official fields from Facebook Marketing API documentation
    const params: Record<string, any> = {
      fields: 'id,name,adset_id,campaign_id,status,created_time,updated_time,effective_status,configured_status,bid_amount,creative',
    };
    
    if (limit) {
      params.limit = limit;
    }
    
    if (status) {
      params.effective_status = status;
    }
    
    const response = await apiRequest<{ data: any[] }>(
      baseUrl,
      path,
      accessToken,
      'GET',
      params
    );
    
    return response.data.map(ad => ({
      id: ad.id,
      name: ad.name,
      adset_id: ad.adset_id,
      campaign_id: ad.campaign_id,
      status: ad.status,
      effective_status: ad.effective_status,
      configured_status: ad.configured_status,
      bid_amount: ad.bid_amount,
      createdTime: ad.created_time,
      updatedTime: ad.updated_time,
      creative: ad.creative
    }));
  } catch (error) {
    handleApiError(error, 'getAccountAds');
    throw error;
  }
}

/**
 * Gets details for a specific ad
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adId Ad ID
 * @returns Promise with ad details
 */
export async function getAd(
  baseUrl: string,
  accessToken: string,
  adId: string
): Promise<Ad> {
  try {
    const path = `${adId}`;
    // Using official fields from Facebook Marketing API documentation
    const params = {
      fields: 'id,name,adset_id,campaign_id,status,created_time,updated_time,effective_status,configured_status,bid_amount,creative,tracking_specs,adlabels,conversion_domain'
    };
    
    const ad = await apiRequest<any>(
      baseUrl,
      path,
      accessToken,
      'GET',
      params
    );
    
    return {
      id: ad.id,
      name: ad.name,
      adset_id: ad.adset_id,
      campaign_id: ad.campaign_id, 
      status: ad.status,
      effective_status: ad.effective_status,
      configured_status: ad.configured_status,
      bid_amount: ad.bid_amount,
      tracking_specs: ad.tracking_specs,
      adlabels: ad.adlabels,
      conversion_domain: ad.conversion_domain,
      createdTime: ad.created_time,
      updatedTime: ad.updated_time,
      creative: ad.creative
    };
  } catch (error) {
    handleApiError(error, `getAd(${adId})`);
    throw error;
  }
}

/**
 * Updates an existing ad with new configuration
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adId Ad ID to update
 * @param config New ad configuration
 * @returns Promise with update response
 */
export async function updateAd(
  baseUrl: string,
  accessToken: string,
  adId: string,
  config: Partial<AdConfig>
): Promise<AdResponse> {
  try {
    // Prepare parameters
    const params: Record<string, any> = humps.decamelizeKeys({
      name: config.name,
      status: config.status,
      bidAmount: config.bidAmount,
      trackingSpecs: config.trackingSpecs,
      conversionDomain: config.conversionDomain,
      adlabels: config.adlabels,
      display_sequence: config.display_sequence,
      engagement_audience: config.engagement_audience
    });
    
    // Handle creative separately since it needs a different update approach
    if (config.creative) {
      // Update or create the ad creative
      const ad: Ad = await getAd(baseUrl, accessToken, adId);
      
      // If the ad has a creative with an ID property
      if (ad.creative && typeof ad.creative === 'object' && ad.creative !== null) {
        // Use a type assertion to tell TypeScript the structure
        const creativeObj = ad.creative as { id: string };
        if ('id' in creativeObj) {
          params.creative = { creative_id: creativeObj.id };
        }
      }
    }
    
    // Make the update request
    const response = await apiRequest<{success: boolean}>(
      baseUrl,
      adId,
      accessToken,
      'POST',
      params
    );
    
    // Fetch the updated ad
    const updatedAd = await getAd(baseUrl, accessToken, adId);
    
    return {
      id: adId,
      success: response.success || true,
      data: updatedAd
    };
  } catch (error) {
    handleApiError(error, `update ad ${adId}`);
    throw error;
  }
} 