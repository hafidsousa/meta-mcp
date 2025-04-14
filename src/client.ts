/**
 * @fileoverview Facebook Marketing API Client for Glowie
 * 
 * @note For AI Assistants:
 * - Use instance methods for Campaign/AdSet/Ad operations
 * - Handle errors appropriately and provide detailed logs
 * - Maintain proper typing with facebook-nodejs-business-sdk
 * - Follow Facebook's best practices for ad management
 * - All monetary values should be in cents (2000 = $20.00)
 */

import { Campaign, AdSet, Ad, AdAccount, FacebookAdsApi } from 'facebook-nodejs-business-sdk';
import {
  FacebookConfig,
  CampaignConfig,
  AdSetConfig,
  AdConfig,
  CampaignResponse,
  AdSetResponse,
  AdResponse
} from './types';
import {
  DEFAULT_CAMPAIGN_CONFIG,
  DEFAULT_ADSET_CONFIG,
  DEFAULT_CREATIVE_CONFIG,
  mergeConfig
} from './config';
import { FacebookMarketingError, ErrorCodes } from './errors';

export class FacebookMarketingClient {
  private api!: FacebookAdsApi;
  private config: FacebookConfig;

  constructor(config: FacebookConfig) {
    this.validateConfig(config);
    this.config = config;
    this.initializeApi();
  }

  private validateConfig(config: FacebookConfig) {
    if (!config.accessToken?.trim()) {
      throw new FacebookMarketingError(
        'Access token is required',
        ErrorCodes.INVALID_CREDENTIALS
      );
    }
    if (!config.appSecret?.trim()) {
      throw new FacebookMarketingError(
        'App secret is required',
        ErrorCodes.INVALID_CREDENTIALS
      );
    }
    if (!config.adAccountId?.trim()) {
      throw new FacebookMarketingError(
        'Ad account ID is required',
        ErrorCodes.INVALID_CREDENTIALS
      );
    }
  }

  private initializeApi() {
    try {
      this.api = FacebookAdsApi.init(this.config.accessToken);
    } catch (error) {
      throw new FacebookMarketingError(
        'Failed to initialize Facebook API',
        ErrorCodes.API_ERROR,
        error
      );
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

      const campaign = await this.api.createCampaign({
        ...config,
        account_id: this.config.adAccountId
      });

      return {
        success: true,
        id: campaign.id,
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
      const adset = await this.api.createAdSet({
        ...finalConfig,
        account_id: this.config.adAccountId
      });

      return {
        id: adset.id,
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
      
      const ad = await this.api.createAd({
        ...config,
        account_id: this.config.adAccountId,
        creative: creative
      });

      return {
        id: ad.id,
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
  async getAdSets(campaignId: string) {
    return this.api.getAdSets([campaignId]);
  }

  /**
   * Gets all ads for an ad set
   * @param adSetId ID of the ad set
   * @returns Promise with list of ads
   */
  async getAds(adSetId: string) {
    return this.api.getAds([adSetId]);
  }

  /**
   * Pauses an active campaign
   * @param campaignId ID of campaign to pause
   * @returns Promise indicating success/failure
   */
  async pauseCampaign(campaignId: string): Promise<boolean> {
    try {
      const campaign = new Campaign(campaignId);
      await campaign.update({
        status: 'PAUSED'
      });
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
      const adSet = new AdSet(adSetId);
      await adSet.update({
        status: 'PAUSED'
      });
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
      const ad = new Ad(adId);
      await ad.update({
        status: 'PAUSED'
      });
      return true;
    } catch (error) {
      console.error('Error pausing ad:', error);
      return false;
    }
  }
} 