/**
 * @fileoverview Ad Set operations for Facebook Marketing API
 * 
 * @note IMPORTANT: All fields in request payloads must be in camelCase format.
 * This is especially important for targeting parameters (use 'geoLocations' not 'geo_locations',
 * 'ageMin' not 'age_min', etc). The API client expects camelCase and will not properly
 * process snake_case fields.
 */

import { AdSet, AdSetConfig, AdSetResponse } from '../types';
import { apiRequest, handleApiError } from '../utils/api';
import { FacebookMarketingError } from '../errors';
import * as humps from 'humps';

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
    
    // Add promoted object - convert to snake_case using humps
    if (promotedObject) {
      params.promoted_object = humps.decamelizeKeys(promotedObject);
    }
    
    // Add destination type
    if (destinationType) {
      params.destination_type = destinationType;
    }
    
    // Add ad schedules
    if (adSchedules) {
      params.ad_schedules = adSchedules;
    }

    // Handle targeting - convert to snake_case using humps for the Facebook API
    if (targeting) {
      // Convert all keys from camelCase to snake_case properly handling nested objects
      const targetingObj = humps.decamelizeKeys(targeting);
      
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
    // Pass detailed error information when available
    if (error instanceof FacebookMarketingError && error.errorDetails) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.errorDetails
        }
      };
    }
    
    // Otherwise handle using the standard error handler
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
    
    // Add targeting if provided - convert to snake_case using humps
    if (config.targeting) {
      const targetingObj = humps.decamelizeKeys(config.targeting);
      params.targeting = JSON.stringify(targetingObj);
    }
    
    // Add optimization goal if provided
    if (config.optimizationGoal) {
      params.optimization_goal = config.optimizationGoal;
    }
    
    // Add billing event if provided
    if (config.billingEvent) {
      params.billing_event = config.billingEvent;
    }
    
    // Add promoted object if specified - convert to snake_case using humps
    if (config.promotedObject) {
      params.promoted_object = humps.decamelizeKeys(config.promotedObject);
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