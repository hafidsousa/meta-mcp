/**
 * Command-line tool to create a Facebook Ad Campaign
 * Usage: npx ts-node src/create-campaign.ts
 * 
 * This script creates a simple campaign with the OUTCOME_SALES objective
 */

import { config as loadEnv } from 'dotenv';
import { 
  FacebookMarketingClient, 
  CampaignConfig,
  FacebookConfig 
} from './';

// Load environment variables
loadEnv();

// Format date for naming conventions
const today = new Date();
const dateStr = `${today.getMonth()+1}-${today.getDate()}-${today.getFullYear()}`;

// Initialize Facebook client with environment variables
const fbConfig: FacebookConfig = {
  adAccountId: process.env.FB_AD_ACCOUNT_ID || '',
  accessToken: process.env.FB_ACCESS_TOKEN || '',
  appId: process.env.FB_APP_ID || '',
  appSecret: process.env.FB_APP_SECRET || ''
};

// Validate required environment variables
if (!fbConfig.adAccountId) {
  console.error('Error: FB_AD_ACCOUNT_ID environment variable is required');
  process.exit(1);
}

if (!fbConfig.accessToken) {
  console.error('Error: FB_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

console.log(`Using ad account ID: ${fbConfig.adAccountId}`);
const client = new FacebookMarketingClient(fbConfig);

const createAdCampaign = async () => {
  try {
    console.log('Creating new ad campaign...');
    
    // Create Campaign
    const campaignConfig: CampaignConfig = {
      name: `Dummy-Campaign-${dateStr}`,
      objective: 'OUTCOME_SALES',
      status: 'PAUSED',  // Start as paused for safety
      specialAdCategories: []
    };
    
    console.log(`Campaign: ${campaignConfig.name}`);
    const campaignResponse = await client.createCampaign(campaignConfig);
    
    if (!campaignResponse || !campaignResponse.success) {
      console.error('Failed to create campaign');
      return;
    }
    
    console.log(`Campaign created successfully! ID: ${campaignResponse.id}`);
    console.log('\nDummy campaign created with PAUSED status.');
    console.log('You can review it in Facebook Ads Manager and create ad sets and ads there.');
    
  } catch (error) {
    console.error('Error creating ad campaign:', error);
    process.exit(1);
  }
};

createAdCampaign().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 