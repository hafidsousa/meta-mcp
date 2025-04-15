/**
 * @fileoverview Ad Set operations for Facebook Marketing API
 */

import { AdSet, AdSetConfig, AdSetResponse } from '../types';
import { apiRequest, handleApiError } from '../utils/api';
import { mergeConfig } from '../config';
import { DEFAULT_ADSET_CONFIG } from '../config';

// Define the AdSetConfigType interface to be compatible with Partial<AdSetConfig>
interface AdSetConfigType {
  name?: string;
  campaignId?: string;
  status?: string;
  optimizationGoal?: string;
  billingEvent?: string;
  bidAmount?: number;
  dailyBudget?: number;
  lifetimeBudget?: number;
  startTime?: string;
  endTime?: string;
  targeting?: any;
  pacingType?: string[];
  bidStrategy?: string;
  attributionSpec?: Record<string, any>[];
  useAverageCost?: boolean;
  promotedObject?: Record<string, any>;
  destinationType?: string;
  adSchedules?: Record<string, any>[];
}

/**
 * Converts object keys from camelCase to snake_case
 * @param obj Object to convert
 * @returns New object with converted keys
 */
function convertKeysToSnakeCase(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    // Handle nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = convertKeysToSnakeCase(value);
    } else {
      result[snakeKey] = value;
    }
  });
  
  return result;
}

/**
 * Creates a new ad set within a campaign
 * @param baseUrl Base URL for the API
 * @param adAccountId Ad account ID
 * @param accessToken Facebook access token
 * @param adSetConfig Ad set configuration
 * @returns Promise with ad set creation response
 */
export async function createAdSet(
  baseUrl: string,
  adAccountId: string,
  accessToken: string,
  adSetConfig: AdSetConfigType
): Promise<AdSetResponse> {
  try {
    const {
      name,
      campaignId,
      status = 'PAUSED',
      optimizationGoal,
      billingEvent,
      bidAmount,
      dailyBudget,
      lifetimeBudget,
      startTime,
      endTime,
      targeting,
      pacingType,
      bidStrategy,
      attributionSpec,
      useAverageCost,
      promotedObject,
      destinationType,
      adSchedules
    } = adSetConfig;

    // Validate required fields
    if (!name) throw new Error('Ad set name is required');
    if (!campaignId) throw new Error('Campaign ID is required');
    if (!targeting) throw new Error('Targeting is required');

    // Path for creating an ad set
    const path = `act_${adAccountId}/adsets`;

    // Prepare the parameters for the API request
    const params: any = {
      campaign_id: campaignId,
      name,
      status,
      special_ad_categories: [],
    };

    // Add optimization goal
    if (optimizationGoal) {
      params.optimization_goal = optimizationGoal;
    }

    // Add billing event
    if (billingEvent) {
      params.billing_event = billingEvent;
    }

    // Add bid amount
    if (bidAmount) {
      params.bid_amount = bidAmount;
    }

    // Add budget (either daily or lifetime, not both)
    if (dailyBudget) {
      params.daily_budget = dailyBudget;
    }
    
    if (lifetimeBudget) {
      params.lifetime_budget = lifetimeBudget;
    }

    // Add start and end times
    if (startTime) {
      params.start_time = startTime;
    }

    if (endTime) {
      params.end_time = endTime;
    }
    
    // Add bid strategy
    if (bidStrategy) {
      params.bid_strategy = bidStrategy;
    }
    
    // Add attribution spec
    if (attributionSpec) {
      params.attribution_spec = attributionSpec;
    }
    
    // Add use average cost
    if (useAverageCost !== undefined) {
      params.use_average_cost = useAverageCost;
    }
    
    // Add promoted object
    if (promotedObject) {
      params.promoted_object = convertKeysToSnakeCase(promotedObject);
    }
    
    // Add destination type
    if (destinationType) {
      params.destination_type = destinationType;
    }
    
    // Add ad schedules
    if (adSchedules) {
      params.ad_schedules = adSchedules;
    }

    // Handle targeting separately to fix serialization issues
    if (targeting) {
      // Convert from camelCase to snake_case naming convention
      const targetingObj: Record<string, any> = {};
      
      // Handle geoLocations special case
      if (targeting.geoLocations) {
        targetingObj.geo_locations = {};
        
        if (targeting.geoLocations.countries) {
          targetingObj.geo_locations.countries = targeting.geoLocations.countries;
        }
        
        if (targeting.geoLocations.regions) {
          targetingObj.geo_locations.regions = targeting.geoLocations.regions;
        }
        
        if (targeting.geoLocations.cities) {
          targetingObj.geo_locations.cities = targeting.geoLocations.cities;
        }
        
        if (targeting.geoLocations.zips) {
          targetingObj.geo_locations.zips = targeting.geoLocations.zips;
        }
      }
      
      // Handle other targeting parameters
      if (targeting.ageMin !== undefined) targetingObj.age_min = targeting.ageMin;
      if (targeting.ageMax !== undefined) targetingObj.age_max = targeting.ageMax;
      if (targeting.genders) targetingObj.genders = targeting.genders;
      if (targeting.interests) targetingObj.interests = targeting.interests;
      if (targeting.behaviors) targetingObj.behaviors = targeting.behaviors;
      if (targeting.locales) targetingObj.locales = targeting.locales;
      if (targeting.publisherPlatforms) targetingObj.publisher_platforms = targeting.publisherPlatforms;
      if (targeting.facebookPositions) targetingObj.facebook_positions = targeting.facebookPositions;
      if (targeting.instagramPositions) targetingObj.instagram_positions = targeting.instagramPositions;
      if (targeting.devicePlatforms) targetingObj.device_platforms = targeting.devicePlatforms;
      if (targeting.userOs) targetingObj.user_os = targeting.userOs;
      if (targeting.userDevice) targetingObj.user_device = targeting.userDevice;
      if (targeting.flexibleSpec) targetingObj.flexible_spec = targeting.flexibleSpec;
      if (targeting.exclusions) targetingObj.exclusions = targeting.exclusions;
      if (targeting.customAudiences) targetingObj.custom_audiences = targeting.customAudiences;
      if (targeting.excludedInterests) targetingObj.excluded_interests = targeting.excludedInterests;
      if (targeting.excludedDemographics) targetingObj.excluded_demographics = targeting.excludedDemographics;
      
      // Properly stringify the targeting object
      params.targeting = JSON.stringify(targetingObj);
    }

    // Add pacing type
    if (pacingType) {
      params.pacing_type = pacingType;
    }

    // Make the API request
    const response = await apiRequest<{ id: string }>(
      baseUrl,
      path,
      accessToken,
      'POST',
      params
    );

    return {
      success: true,
      id: response.id,
      data: {
        id: response.id,
        name,
        campaign_id: campaignId,
        status
      } as AdSet
    };
  } catch (error) {
    handleApiError(error, 'create ad set');
    throw error;
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
    // Define fields to request, removing fields that cause errors
    const fields = [
      'id', 'name', 'campaign_id', 'daily_budget', 'lifetime_budget',
      'bid_amount', 'bid_strategy', 'billing_event', 'optimization_goal',
      'targeting', 'status', 'start_time', 'end_time', 'created_time',
      'updated_time', 'promoted_object', 'attribution_spec',
      'pacing_type', 'budget_remaining', 'effective_status', 'adlabels',
      'destination_type', 'configured_status'
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
    throw error;
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
        'updated_time', 'promoted_object', 'attribution_spec',
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
    throw error;
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
    throw error;
  }
} 