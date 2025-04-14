/**
 * @fileoverview Facebook Marketing API Client for Meta Client Platform
 * 
 * @note For AI Assistants:
 * - Use instance methods for Campaign/AdSet/Ad operations
 * - Handle errors appropriately and provide detailed logs
 * - Directly use Facebook Graph API without SDK dependencies
 * - Follow Facebook's best practices for ad management
 * - All monetary values should be in cents (2000 = $20.00)
 */

import {
  FacebookConfig,
  CampaignConfig,
  AdSetConfig,
  AdConfig,
  CampaignResponse,
  AdSetResponse,
  AdResponse,
  Campaign,
  AdSet,
  Ad
} from './types';
import {
  DEFAULT_ADSET_CONFIG,
  DEFAULT_CREATIVE_CONFIG,
  FB_API_VERSION,
  mergeConfig
} from './config';
import { FacebookMarketingError, ErrorCodes } from './errors';

export class FacebookMarketingClient {
  private baseUrl: string;
  private config: FacebookConfig;

  constructor(config: FacebookConfig) {
    this.validateConfig(config);
    this.config = config;
    this.baseUrl = `https://graph.facebook.com/${FB_API_VERSION}`;
  }

  private validateConfig(config: FacebookConfig) {
    if (!config.accessToken?.trim()) {
      throw new FacebookMarketingError(
        'Access token is required',
        ErrorCodes.INVALID_CREDENTIALS
      );
    }
    // App secret is optional when using MCP tools
    if (!config.adAccountId?.trim()) {
      throw new FacebookMarketingError(
        'Ad account ID is required',
        ErrorCodes.INVALID_CREDENTIALS
      );
    }
  }

  /**
   * Makes a Graph API request
   * @param path API endpoint path
   * @param method HTTP method
   * @param params Request parameters
   * @returns Promise with API response
   */
  private async apiRequest<T>(
    path: string, 
    method: 'GET' | 'POST' | 'DELETE' = 'GET', 
    params: Record<string, any> = {}
  ): Promise<T> {
    try {
      // Always include access token
      params.access_token = this.config.accessToken;
      
      const url = `${this.baseUrl}/${path}`;
      let response;
      
      if (method === 'GET') {
        // For GET requests, append params to URL
        const queryParams: Record<string, string> = {};
        
        // Convert all values to strings
        Object.entries(params).forEach(([key, value]) => {
          if (typeof value === 'object') {
            queryParams[key] = JSON.stringify(value);
          } else {
            queryParams[key] = String(value);
          }
        });
        
        const queryString = new URLSearchParams(queryParams).toString();
        response = await fetch(`${url}?${queryString}`);
      } else {
        // For POST/DELETE, use request body
        const body = new URLSearchParams();
        
        for (const [key, value] of Object.entries(params)) {
          if (typeof value === 'object') {
            body.append(key, JSON.stringify(value));
          } else {
            body.append(key, String(value));
          }
        }
        
        response = await fetch(url, {
          method,
          body,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      }
      
      const data = await response.json() as any;
      
      if (!response.ok || data.error) {
        throw new Error(
          data.error?.message || 
          data.error_message || 
          `API request failed with status ${response.status}`
        );
      }
      
      return data as T;
    } catch (error) {
      this.handleApiError(error, `${method} ${path}`);
      throw error; // This will never execute due to handleApiError, but needed for TypeScript
    }
  }

  private handleApiError(error: unknown, operation: string): never {
    if (error instanceof Error) {
      // Handle rate limiting
      if (error.message.includes('rate limit')) {
        throw new FacebookMarketingError(
          `Rate limit exceeded during ${operation}`,
          ErrorCodes.RATE_LIMIT,
          error
        );
      }
      
      // Handle network errors
      if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
        throw new FacebookMarketingError(
          `Network error during ${operation}`,
          ErrorCodes.NETWORK_ERROR,
          error
        );
      }
    }

    // Generic API error
    throw new FacebookMarketingError(
      `Error during ${operation}`,
      ErrorCodes.API_ERROR,
      error
    );
  }

  /**
   * Creates a new campaign with specified configuration
   * @param config Campaign configuration object
   * @returns Promise with campaign creation response
   */
  async createCampaign(config: CampaignConfig): Promise<CampaignResponse> {
    try {
      // Validate required campaign fields
      if (!config.name?.trim()) {
        throw new FacebookMarketingError(
          'Campaign name is required',
          ErrorCodes.VALIDATION_ERROR
        );
      }

      // Convert camelCase to snake_case for API params
      const params = {
        name: config.name,
        objective: config.objective,
        status: config.status,
        special_ad_categories: config.specialAdCategories || []
      };

      const response = await this.apiRequest<{id: string}>(
        `act_${this.config.adAccountId}/campaigns`, 
        'POST',
        params
      );

      // Get the created campaign
      const campaign = await this.apiRequest<Campaign>(
        `${response.id}`,
        'GET',
        { fields: 'id,name,objective,status,created_time,start_time,stop_time,spend_cap' }
      );

      return {
        success: true,
        id: response.id,
        data: campaign
      };
    } catch (error) {
      this.handleApiError(error, 'create campaign');
    }
  }

  /**
   * Creates a new ad set within a campaign
   * @param config Ad set configuration object
   * @returns Promise with ad set creation response
   */
  async createAdSet(config: Partial<AdSetConfig>): Promise<AdSetResponse> {
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

      const response = await this.apiRequest<{id: string}>(
        `act_${this.config.adAccountId}/adsets`,
        'POST',
        params
      );

      return {
        id: response.id,
        success: true
      };
    } catch (error) {
      this.handleApiError(error, 'create ad set');
    }
  }

  /**
   * Creates a new ad within an ad set
   * @param config Ad configuration object
   * @returns Promise with ad creation response
   */
  async createAd(config: AdConfig): Promise<AdResponse> {
    try {
      // Merge creative config while preserving required fields from user config
      const creative = {
        ...DEFAULT_CREATIVE_CONFIG,
        ...config.creative
      };
      
      // First create the creative
      const creativeParams = {
        name: creative.name,
        title: creative.title,
        body: creative.body,
        link_url: creative.linkUrl,
        image_url: creative.imageUrl,
        call_to_action_type: creative.callToAction
      };
      
      const creativeResponse = await this.apiRequest<{id: string}>(
        `act_${this.config.adAccountId}/adcreatives`,
        'POST',
        creativeParams
      );
      
      // Then create the ad with the creative
      const adParams = {
        name: config.name,
        adset_id: config.adsetId,
        status: config.status,
        creative: { creative_id: creativeResponse.id }
      };
      
      const adResponse = await this.apiRequest<{id: string}>(
        `act_${this.config.adAccountId}/ads`,
        'POST',
        adParams
      );

      return {
        id: adResponse.id,
        success: true
      };
    } catch (error) {
      this.handleApiError(error, 'create ad');
    }
  }

  /**
   * Gets all ad sets for a campaign
   * @param campaignId ID of the campaign
   * @returns Promise with list of ad sets
   */
  async getAdSets(campaignId: string): Promise<AdSet[]> {
    try {
      const fields = 'id,name,campaign_id,daily_budget,lifetime_budget,targeting,status';
      
      const response = await this.apiRequest<{data: AdSet[]}>(
        `${campaignId}/adsets`,
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
   * Gets all ads for an ad set
   * @param adSetId ID of the ad set
   * @returns Promise with list of ads
   */
  async getAds(adSetId: string): Promise<Ad[]> {
    try {
      const fields = 'id,name,adset_id,creative,status';
      
      const response = await this.apiRequest<{data: Ad[]}>(
        `${adSetId}/ads`,
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
   * Pauses an active campaign
   * @param campaignId ID of campaign to pause
   * @returns Promise indicating success/failure
   */
  async pauseCampaign(campaignId: string): Promise<boolean> {
    try {
      await this.apiRequest(
        campaignId,
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
   * Pauses an active ad set
   * @param adSetId ID of ad set to pause
   * @returns Promise indicating success/failure
   */
  async pauseAdSet(adSetId: string): Promise<boolean> {
    try {
      await this.apiRequest(
        adSetId,
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
   * Pauses an active ad
   * @param adId ID of ad to pause
   * @returns Promise indicating success/failure
   */
  async pauseAd(adId: string): Promise<boolean> {
    try {
      await this.apiRequest(
        adId,
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
   * Gets all available ad accounts for the current user
   * @returns Promise with list of ad accounts
   */
  async getAvailableAdAccounts(): Promise<any[]> {
    try {
      console.log('Fetching ad accounts from Graph API...');
      
      const fields = 'id,name,account_status,amount_spent,currency';
      
      const response = await this.apiRequest<{data: any[]}>(
        'me/adaccounts',
        'GET',
        { fields }
      );
      
      return response.data || [];
    } catch (error) {
      console.error('Error getting ad accounts:', error);
      this.handleApiError(error, 'get ad accounts');
      return [];
    }
  }

  /**
   * Gets all campaigns for an ad account
   * @returns Promise with list of campaigns
   */
  async getCampaigns(): Promise<any[]> {
    try {
      console.log('Fetching campaigns from Graph API...');
      
      console.log(`Fetching campaigns for ad account: act_${this.config.adAccountId}`);
      
      const fields = 'id,name,objective,status,created_time,start_time,stop_time,spend_cap';
      
      const response = await this.apiRequest<{data: any[]}>(
        `act_${this.config.adAccountId}/campaigns`,
        'GET',
        { fields, limit: '100' }
      );
      
      return response.data || [];
    } catch (error) {
      console.error('Error getting campaigns:', error);
      this.handleApiError(error, 'get campaigns');
      return [];
    }
  }
} 