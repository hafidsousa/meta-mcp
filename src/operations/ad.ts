/**
 * @fileoverview Ad operations for Facebook Marketing API
 */

import { Ad, AdConfig, AdResponse } from '../types';
import { apiRequest, handleApiError } from '../utils/api';
import { DEFAULT_CREATIVE_CONFIG } from '../config';

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
    
    // First create the creative
    const creativeParams: Record<string, any> = {
      name: creative.name,
      title: creative.title,
      body: creative.body,
      link_url: creative.linkUrl,
      image_url: creative.imageUrl,
      call_to_action_type: creative.callToAction
    };
    
    // Add URL parameters if specified
    if (creative.urlTags) {
      creativeParams.url_tags = creative.urlTags;
    }
    
    // Add object story spec if available
    if (creative.objectStorySpec) {
      // Convert camelCase to snake_case
      const objectStorySpec: Record<string, any> = {};
      Object.entries(creative.objectStorySpec).forEach(([key, value]) => {
        const snakeCaseKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        objectStorySpec[snakeCaseKey] = value;
      });
      creativeParams.object_story_spec = objectStorySpec;
    }
    
    // Add format if specified
    if (creative.format) {
      creativeParams.format = creative.format;
    }
    
    const creativeResponse = await apiRequest<{id: string}>(
      baseUrl,
      `act_${adAccountId}/adcreatives`,
      accessToken,
      'POST',
      creativeParams
    );
    
    // Then create the ad with the creative
    const adParams: Record<string, any> = {
      name: config.name,
      adset_id: config.adsetId,
      status: config.status,
      creative: { creative_id: creativeResponse.id }
    };
    
    // Add tracking specs if available
    if (config.trackingSpecs) {
      adParams.tracking_specs = config.trackingSpecs;
    }
    
    // Add bid amount if specified
    if (config.bidAmount) {
      adParams.bid_amount = config.bidAmount;
    }
    
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
 * Updates an existing ad
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @param adId Ad ID to update
 * @param config Ad configuration with updated fields
 * @returns Promise with update response
 */
export async function updateAd(
  baseUrl: string,
  accessToken: string,
  adId: string,
  config: Partial<AdConfig>
): Promise<AdResponse> {
  try {
    const path = `${adId}`;
    
    // Prepare update parameters based on official API documentation
    const params: Record<string, any> = {};
    
    // Add name if provided
    if (config.name) {
      params.name = config.name;
    }
    
    // Add status if provided
    if (config.status) {
      params.status = config.status;
    }
    
    // Add creative if provided
    if (config.creative) {
      if (typeof config.creative === 'object') {
        if (config.creative.creative_id) {
          // Handle creative by ID
          params.creative = {
            creative_id: config.creative.creative_id
          };
        } else {
          // Handle full creative object
          params.creative = config.creative;
        }
      } else {
        params.creative = config.creative;
      }
    }
    
    // Add tracking specs if provided
    if (config.trackingSpecs) {
      params.tracking_specs = config.trackingSpecs;
    }
    
    // Add ad labels if provided
    if (config.adlabels) {
      params.adlabels = config.adlabels;
    }
    
    // Add conversion domain if provided
    if (config.conversionDomain) {
      params.conversion_domain = config.conversionDomain;
    }
    
    // Add display sequence if provided
    if (config.display_sequence) {
      params.display_sequence = config.display_sequence;
    }
    
    // Add engagement audience flag if provided
    if (config.engagement_audience !== undefined) {
      params.engagement_audience = config.engagement_audience;
    }
    
    const response = await apiRequest<AdResponse>(
      baseUrl,
      path,
      accessToken,
      'POST',
      params
    );
    return response;
  } catch (error) {
    handleApiError(error, `updateAd(${adId})`);
    throw error;
  }
} 