import { FacebookMarketingClient } from './client';
import { CampaignConfig, AdSetConfig, AdConfig, FacebookConfig } from './types';
import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

// Initialize Facebook client with environment variables
const fbConfig: FacebookConfig = {
  adAccountId: process.env.FB_AD_ACCOUNT_ID || '',
  accessToken: process.env.FB_ACCESS_TOKEN || '',
  appId: process.env.FB_APP_ID || '',
  appSecret: process.env.FB_APP_SECRET || ''
};

const client = new FacebookMarketingClient(fbConfig);

export const createCampaign = async (params: { config: Partial<CampaignConfig> }) => {
  return client.createCampaign(params.config as CampaignConfig);
};

export const createAdSet = async (params: { config: Partial<AdSetConfig> }) => {
  return client.createAdSet(params.config);
};

export const createAd = async (params: { config: AdConfig }) => {
  return client.createAd(params.config);
};

export const getAdSets = async (params: { campaignId: string }) => {
  return client.getAdSets(params.campaignId);
};

export const getAds = async (params: { adSetId: string }) => {
  return client.getAds(params.adSetId);
};

export const pauseCampaign = async (params: { campaignId: string }) => {
  return client.pauseCampaign(params.campaignId);
};

export const pauseAdSet = async (params: { adSetId: string }) => {
  return client.pauseAdSet(params.adSetId);
};

export const pauseAd = async (params: { adId: string }) => {
  return client.pauseAd(params.adId);
};

export const getAvailableAdAccounts = async () => {
  return client.getAvailableAdAccounts();
}; 