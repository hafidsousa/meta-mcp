/**
 * @fileoverview Campaign operations for Facebook Marketing API
 */

import { Campaign, CampaignConfig, CampaignResponse, CampaignStatus } from '../types';
import { apiRequest, handleApiError } from '../utils/api';
import { FacebookMarketingError, ErrorCodes } from '../errors';

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

    // Convert camelCase to snake_case for API params
    const params: Record<string, any> = {
      name: config.name,
      objective: config.objective,
      status: config.status,
      special_ad_categories: config.specialAdCategories || []
    };
    
    // Add spend cap if specified (in cents)
    if (config.spendCap) {
      params.spend_cap = config.spendCap;
    }
    
    // Add bid strategy if specified
    if (config.bidStrategy) {
      params.bid_strategy = config.bidStrategy;
    }
    
    // Add budgets if specified
    if (config.dailyBudget) {
      params.daily_budget = config.dailyBudget;
    }
    
    if (config.lifetimeBudget) {
      params.lifetime_budget = config.lifetimeBudget;
    }
    
    // Add campaign budget optimization if specified
    if (config.campaignBudgetOptimization !== undefined) {
      params.campaign_budget_optimization = config.campaignBudgetOptimization;
    }
    
    // Add ROAS target if specified
    if (config.minRoasTargetValue) {
      params.min_roas_target_value = config.minRoasTargetValue;
    }
    
    // Add ad labels if specified
    if (config.adLabels?.length) {
      params.adlabels = config.adLabels;
    }
    
    // Add time parameters if specified
    if (config.startTime) {
      params.start_time = config.startTime;
    }
    
    if (config.stopTime) {
      params.stop_time = config.stopTime;
    }
    
    // Add boosted object if specified
    if (config.boostedObjectId) {
      params.boosted_object_id = config.boostedObjectId;
    }
    
    // Add promoted object if specified
    if (config.promotedObject) {
      const promotedObject: Record<string, any> = {};
      
      if (config.promotedObject.pageId) {
        promotedObject.page_id = config.promotedObject.pageId;
      }
      
      if (config.promotedObject.applicationId) {
        promotedObject.application_id = config.promotedObject.applicationId;
      }
      
      if (config.promotedObject.objectStoreUrl) {
        promotedObject.object_store_url = config.promotedObject.objectStoreUrl;
      }
      
      if (config.promotedObject.customEventType) {
        promotedObject.custom_event_type = config.promotedObject.customEventType;
      }
      
      if (config.promotedObject.offerId) {
        promotedObject.offer_id = config.promotedObject.offerId;
      }
      
      if (config.promotedObject.pixelId) {
        promotedObject.pixel_id = config.promotedObject.pixelId;
      }
      
      if (config.promotedObject.productSetId) {
        promotedObject.product_set_id = config.promotedObject.productSetId;
      }
      
      if (config.promotedObject.productCatalogId) {
        promotedObject.product_catalog_id = config.promotedObject.productCatalogId;
      }
      
      if (config.promotedObject.placePageSetId) {
        promotedObject.place_page_set_id = config.promotedObject.placePageSetId;
      }
      
      params.promoted_object = promotedObject;
    }
    
    // Add SKAdNetwork attribution if specified
    if (config.isSkadnetworkAttribution !== undefined) {
      params.is_skadnetwork_attribution = config.isSkadnetworkAttribution;
    }
    
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
  config: Partial<CampaignConfig>
): Promise<CampaignResponse> {
  try {
    // Convert camelCase to snake_case for API params
    const params: Record<string, any> = {};
    
    // Only include specified fields in the update
    if (config.name) {
      params.name = config.name;
    }
    
    if (config.status) {
      params.status = config.status;
    }
    
    if (config.objective) {
      params.objective = config.objective;
    }
    
    if (config.specialAdCategories) {
      params.special_ad_categories = config.specialAdCategories;
    }
    
    if (config.spendCap !== undefined) {
      params.spend_cap = config.spendCap;
    }
    
    if (config.bidStrategy) {
      params.bid_strategy = config.bidStrategy;
    }
    
    if (config.dailyBudget !== undefined) {
      params.daily_budget = config.dailyBudget;
    }
    
    if (config.lifetimeBudget !== undefined) {
      params.lifetime_budget = config.lifetimeBudget;
    }
    
    if (config.campaignBudgetOptimization !== undefined) {
      params.campaign_budget_optimization = config.campaignBudgetOptimization;
    }
    
    if (config.minRoasTargetValue !== undefined) {
      params.min_roas_target_value = config.minRoasTargetValue;
    }
    
    if (config.adLabels) {
      params.adlabels = config.adLabels;
    }
    
    if (config.startTime) {
      params.start_time = config.startTime;
    }
    
    if (config.stopTime) {
      params.stop_time = config.stopTime;
    }
    
    if (config.boostedObjectId) {
      params.boosted_object_id = config.boostedObjectId;
    }
    
    if (config.promotedObject) {
      const promotedObject: Record<string, any> = {};
      
      if (config.promotedObject.pageId) {
        promotedObject.page_id = config.promotedObject.pageId;
      }
      
      if (config.promotedObject.applicationId) {
        promotedObject.application_id = config.promotedObject.applicationId;
      }
      
      if (config.promotedObject.objectStoreUrl) {
        promotedObject.object_store_url = config.promotedObject.objectStoreUrl;
      }
      
      if (config.promotedObject.customEventType) {
        promotedObject.custom_event_type = config.promotedObject.customEventType;
      }
      
      if (config.promotedObject.offerId) {
        promotedObject.offer_id = config.promotedObject.offerId;
      }
      
      if (config.promotedObject.pixelId) {
        promotedObject.pixel_id = config.promotedObject.pixelId;
      }
      
      if (config.promotedObject.productSetId) {
        promotedObject.product_set_id = config.promotedObject.productSetId;
      }
      
      if (config.promotedObject.productCatalogId) {
        promotedObject.product_catalog_id = config.promotedObject.productCatalogId;
      }
      
      if (config.promotedObject.placePageSetId) {
        promotedObject.place_page_set_id = config.promotedObject.placePageSetId;
      }
      
      params.promoted_object = promotedObject;
    }
    
    if (config.isSkadnetworkAttribution !== undefined) {
      params.is_skadnetwork_attribution = config.isSkadnetworkAttribution;
    }
    
    // Only proceed if there are parameters to update
    if (Object.keys(params).length === 0) {
      throw new FacebookMarketingError(
        'No valid fields provided for campaign update',
        ErrorCodes.VALIDATION_ERROR
      );
    }
    
    await apiRequest<{success: boolean}>(
      baseUrl,
      campaignId,
      accessToken,
      'POST',
      params
    );
    
    // Get the updated campaign
    const campaign = await getCampaign(baseUrl, accessToken, campaignId);
    
    return {
      success: true,
      id: campaignId,
      data: campaign
    };
  } catch (error) {
    handleApiError(error, `update campaign ${campaignId}`);
  }
} 