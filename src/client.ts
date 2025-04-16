/**
 * @fileoverview Facebook Marketing API Client for Meta Client Platform
 * 
 * @note IMPORTANT: This is a pure pass-through proxy. All requests and responses
 * are passed directly to and from the Facebook API without modification.
 * All request payloads must use Facebook API's required formats (snake_case).
 * The Facebook API documentation should be referenced for all parameters:
 * https://developers.facebook.com/docs/marketing-apis/
 */

import { FB_API_VERSION } from './config';

// Import operations from modular files
import * as CampaignOperations from './operations/campaign';
import * as AdSetOperations from './operations/adset';
import * as AdOperations from './operations/ad';
import * as AccountOperations from './operations/account';

/**
 * Configuration for the Facebook Marketing API client
 */
export interface FacebookClientConfig {
  /**
   * Facebook Access Token
   */
  accessToken: string;
  
  /**
   * Facebook Ad Account ID (without the 'act_' prefix)
   */
  adAccountId: string;
  
  /**
   * Optional debug mode flag
   */
  debug?: boolean;
}

/**
 * Facebook Marketing API Client
 * Facade pattern implementation for Facebook Marketing API
 */
export class FacebookMarketingClient {
  private baseUrl: string;
  private config: any;

  /**
   * Creates a new Facebook Marketing API client
   * @param config Configuration containing credentials and settings
   */
  constructor(config: FacebookClientConfig) {
    if (!config.accessToken || !config.adAccountId) {
      throw new Error('Access token and ad account ID are required');
    }
    
    this.config = config;
    this.baseUrl = `https://graph.facebook.com/${FB_API_VERSION}`;
  }

  // Campaign Operations
  /**
   * Creates a new campaign with specified configuration
   * @param config Campaign configuration object (in snake_case format)
   * @returns Promise with campaign creation response
   */
  async createCampaign(config: any): Promise<any> {
    return CampaignOperations.createCampaign(
      this.baseUrl,
      this.config.adAccountId,
      this.config.accessToken,
      config
    );
  }

  /**
   * Pauses an active campaign
   * @param campaignId ID of campaign to pause
   * @returns Promise indicating success/failure
   */
  async pauseCampaign(campaignId: string): Promise<boolean> {
    return CampaignOperations.pauseCampaign(
      this.baseUrl,
      this.config.accessToken,
      campaignId
    );
  }

  /**
   * Retrieves a specific campaign by ID with all available fields
   * @param campaignId The ID of the campaign to retrieve
   * @returns Promise with campaign data
   */
  async getCampaign(campaignId: string): Promise<any> {
    return CampaignOperations.getCampaign(
      this.baseUrl,
      this.config.accessToken,
      campaignId
    );
  }

  /**
   * Retrieves all campaigns for the ad account with full details
   * @param limit Optional limit on number of campaigns to return
   * @param status Optional status filter (ACTIVE, PAUSED, etc.)
   * @param datePreset Optional predefined date range
   * @param timeRange Optional custom date range object {since, until}
   * @returns Promise with array of campaigns
   */
  async getCampaigns(
    limit?: number, 
    status?: string,
    datePreset?: string,
    timeRange?: { since: string; until: string }
  ): Promise<any[]> {
    return CampaignOperations.getCampaigns(
      this.baseUrl,
      this.config.adAccountId,
      this.config.accessToken,
      limit,
      status,
      datePreset,
      timeRange
    );
  }

  /**
   * Updates an existing campaign with new configuration
   * @param campaignId The ID of the campaign to update
   * @param config Campaign configuration object with fields to update (in snake_case format)
   * @returns Promise with updated campaign data
   */
  async updateCampaign(campaignId: string, config: any): Promise<any> {
    return CampaignOperations.updateCampaign(
      this.baseUrl,
      this.config.accessToken,
      campaignId,
      config
    );
  }

  // Ad Set Operations
  /**
   * Creates a new ad set within a campaign
   * @param config Ad set configuration object (in snake_case format)
   * @returns Promise with ad set creation response
   */
  async createAdSet(config: any): Promise<any> {
    return AdSetOperations.createAdSet(
      this.baseUrl,
      this.config.adAccountId,
      this.config.accessToken,
      config
    );
  }

  /**
   * Gets all ad sets for a campaign
   * @param campaignId ID of the campaign
   * @returns Promise with list of ad sets
   */
  async getAdSets(campaignId: string): Promise<any[]> {
    return AdSetOperations.getAdSets(
      this.baseUrl,
      this.config.accessToken,
      campaignId
    );
  }

  /**
   * Pauses an active ad set
   * @param adSetId ID of ad set to pause
   * @returns Promise indicating success/failure
   */
  async pauseAdSet(adSetId: string): Promise<boolean> {
    return AdSetOperations.pauseAdSet(
      this.baseUrl,
      this.config.accessToken,
      adSetId
    );
  }

  /**
   * Retrieves a specific ad set by ID with all available fields
   * @param adSetId The ID of the ad set to retrieve
   * @returns Promise with ad set data
   */
  async getAdSet(adSetId: string): Promise<any> {
    return AdSetOperations.getAdSet(
      this.baseUrl,
      this.config.accessToken,
      adSetId
    );
  }

  /**
   * Gets ad sets for an ad account
   * @param limit Optional maximum number of ad sets to return
   * @param status Optional status filter
   * @returns Promise with array of ad sets
   */
  async getAccountAdSets(limit?: number, status?: string): Promise<any[]> {
    return AdSetOperations.getAccountAdSets(
      this.baseUrl,
      this.config.adAccountId,
      this.config.accessToken,
      limit,
      status
    );
  }

  /**
   * Updates an existing ad set
   * @param adSetId ID of the ad set to update
   * @param config Ad set configuration with fields to update (in snake_case format)
   * @returns Promise with updated ad set data
   */
  async updateAdSet(adSetId: string, config: any): Promise<any> {
    return AdSetOperations.updateAdSet(
      this.baseUrl,
      this.config.accessToken,
      adSetId,
      config
    );
  }

  // Ad Operations
  /**
   * Creates a new ad
   * @param config Ad configuration (in snake_case format)
   * @returns Promise with ad creation response
   */
  async createAd(config: any): Promise<any> {
    return AdOperations.createAd(
      this.baseUrl,
      this.config.adAccountId,
      this.config.accessToken,
      config
    );
  }

  /**
   * Retrieves ads for an ad set
   * @param adSetId Ad set ID
   * @returns Promise with array of ads
   */
  async getAds(adSetId: string): Promise<any[]> {
    return AdOperations.getAds(
      this.baseUrl,
      this.config.accessToken,
      adSetId
    );
  }

  /**
   * Pauses an active ad
   * @param adId ID of ad to pause
   * @returns Promise indicating success/failure
   */
  async pauseAd(adId: string): Promise<boolean> {
    return AdOperations.pauseAd(
      this.baseUrl,
      this.config.accessToken,
      adId
    );
  }

  /**
   * Gets ads for an ad account
   * @param limit Optional maximum number of ads to return
   * @param status Optional status filter
   * @returns Promise with array of ads
   */
  async getAccountAds(limit?: number, status?: string): Promise<any[]> {
    return AdOperations.getAccountAds(
      this.baseUrl,
      this.config.adAccountId,
      this.config.accessToken,
      limit,
      status
    );
  }

  /**
   * Retrieves a specific ad by ID
   * @param adId The ID of the ad to retrieve
   * @returns Promise with ad data
   */
  async getAd(adId: string): Promise<any> {
    return AdOperations.getAd(
      this.baseUrl,
      this.config.accessToken,
      adId
    );
  }

  /**
   * Updates an existing ad
   * @param adId ID of the ad to update
   * @param config Ad configuration with fields to update (in snake_case format)
   * @returns Promise with updated ad data
   */
  async updateAd(adId: string, config: any): Promise<any> {
    return AdOperations.updateAd(
      this.baseUrl,
      this.config.accessToken,
      adId,
      config
    );
  }

  /**
   * Retrieves available ad accounts for a user
   * @returns Promise with user's available ad accounts
   */
  async getAvailableAdAccounts(): Promise<any[]> {
    return AccountOperations.getAvailableAdAccounts(
      this.baseUrl,
      this.config.accessToken
    );
  }
} 