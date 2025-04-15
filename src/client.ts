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
  Ad,
  CampaignStatus
} from './types';
import { FB_API_VERSION } from './config';
import { FacebookMarketingError, ErrorCodes } from './errors';

// Import operations from modular files
import * as CampaignOperations from './operations/campaign';
import * as AdSetOperations from './operations/adset';
import * as AdOperations from './operations/ad';
import * as AccountOperations from './operations/account';

/**
 * Facebook Marketing API Client
 * Facade pattern implementation for Facebook Marketing API
 */
export class FacebookMarketingClient {
  private baseUrl: string;
  private config: FacebookConfig;

  /**
   * Creates a new Facebook Marketing API client
   * @param config Configuration containing credentials and settings
   */
  constructor(config: FacebookConfig) {
    this.validateConfig(config);
    this.config = config;
    this.baseUrl = `https://graph.facebook.com/${FB_API_VERSION}`;
  }

  /**
   * Validates the client configuration
   * @param config Client configuration
   * @throws Error if configuration is invalid
   */
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

  // Campaign Operations
  /**
   * Creates a new campaign with specified configuration
   * @param config Campaign configuration object
   * @returns Promise with campaign creation response
   */
  async createCampaign(config: CampaignConfig): Promise<CampaignResponse> {
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
  async getCampaign(campaignId: string): Promise<Campaign> {
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
   * @returns Promise with array of campaigns
   */
  async getCampaigns(limit?: number, status?: CampaignStatus): Promise<Campaign[]> {
    return CampaignOperations.getCampaigns(
      this.baseUrl,
      this.config.adAccountId,
      this.config.accessToken,
      limit,
      status
    );
  }

  /**
   * Updates an existing campaign with new configuration
   * @param campaignId The ID of the campaign to update
   * @param config Campaign configuration object with fields to update
   * @returns Promise with updated campaign data
   */
  async updateCampaign(campaignId: string, config: Partial<CampaignConfig>): Promise<CampaignResponse> {
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
   * @param config Ad set configuration object
   * @returns Promise with ad set creation response
   */
  async createAdSet(config: Partial<AdSetConfig>): Promise<AdSetResponse> {
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
  async getAdSets(campaignId: string): Promise<AdSet[]> {
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
  async getAdSet(adSetId: string): Promise<AdSet> {
    return AdSetOperations.getAdSet(
      this.baseUrl,
      this.config.accessToken,
      adSetId
    );
  }

  /**
   * Retrieves all ad sets for the ad account with full details
   * @param limit Optional limit on number of ad sets to return
   * @param status Optional status filter (ACTIVE, PAUSED, etc.)
   * @returns Promise with array of ad sets
   */
  async getAccountAdSets(limit?: number, status?: string): Promise<AdSet[]> {
    return AdSetOperations.getAccountAdSets(
      this.baseUrl,
      this.config.adAccountId,
      this.config.accessToken,
      limit,
      status
    );
  }

  /**
   * Updates an existing ad set with new configuration settings
   * @param adSetId The ID of the ad set to update
   * @param config Ad set configuration with updated fields
   * @returns Promise with update response
   */
  async updateAdSet(adSetId: string, config: Partial<AdSetConfig>): Promise<AdSetResponse> {
    return AdSetOperations.updateAdSet(
      this.baseUrl,
      this.config.accessToken,
      adSetId,
      config
    );
  }

  // Ad Operations
  /**
   * Creates a new ad within an ad set
   * @param config Ad configuration object
   * @returns Promise with ad creation response
   */
  async createAd(config: AdConfig): Promise<AdResponse> {
    return AdOperations.createAd(
      this.baseUrl,
      this.config.adAccountId,
      this.config.accessToken,
      config
    );
  }

  /**
   * Gets all ads for an ad set
   * @param adSetId ID of the ad set
   * @returns Promise with list of ads
   */
  async getAds(adSetId: string): Promise<Ad[]> {
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
   * Gets all ads for the ad account
   * @param limit Optional limit on number of ads to return
   * @param status Optional status filter (ACTIVE, PAUSED, etc.)
   * @returns Promise with array of ads
   */
  async getAccountAds(limit?: number, status?: string): Promise<Ad[]> {
    return AdOperations.getAccountAds(
      this.baseUrl,
      this.config.adAccountId,
      this.config.accessToken,
      limit,
      status
    );
  }

  /**
   * Gets details for a specific ad
   * @param adId Ad ID
   * @returns Promise with ad details
   */
  async getAd(adId: string): Promise<Ad> {
    return AdOperations.getAd(
      this.baseUrl,
      this.config.accessToken,
      adId
    );
  }

  /**
   * Updates an existing ad
   * @param adId Ad ID to update
   * @param config Ad configuration with updated fields
   * @returns Promise with update response
   */
  async updateAd(adId: string, config: Partial<AdConfig>): Promise<AdResponse> {
    return AdOperations.updateAd(
      this.baseUrl,
      this.config.accessToken,
      adId,
      config
    );
  }

  // Account Operations
  /**
   * Gets all available ad accounts for the current user
   * @returns Promise with list of ad accounts
   */
  async getAvailableAdAccounts(): Promise<any[]> {
    return AccountOperations.getAvailableAdAccounts(
      this.baseUrl,
      this.config.accessToken
    );
  }
} 