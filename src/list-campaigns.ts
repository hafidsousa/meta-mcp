/**
 * Command-line tool to list available Facebook Ad Campaigns
 * Usage: npm run list-campaigns
 */

import { config as loadEnv } from 'dotenv';
import { FacebookMarketingClient } from './client';

// Load environment variables
loadEnv();

const accessToken = process.env.FB_ACCESS_TOKEN;
const adAccountId = process.env.FB_AD_ACCOUNT_ID;

if (!accessToken) {
  console.error('Error: FB_ACCESS_TOKEN is required. Please set it in your .env file.');
  process.exit(1);
}

if (!adAccountId) {
  console.error('Error: FB_AD_ACCOUNT_ID is required. Please set it in your .env file.');
  console.error('You can get your ad account ID by running: npm run list-accounts');
  process.exit(1);
}

// Initialize client
const client = new FacebookMarketingClient({
  accessToken,
  adAccountId,
  appId: process.env.FB_APP_ID || '',
  appSecret: process.env.FB_APP_SECRET || '',
});

// For debugging
console.log(`Access token length: ${accessToken.length}`);
console.log(`Access token starts with: ${accessToken.substring(0, 10)}...`);
console.log(`Using ad account ID: ${adAccountId}`);

const listCampaigns = async () => {
  console.log('Fetching campaigns...');
  
  try {
    const campaigns = await client.getCampaigns();
    
    if (!campaigns || campaigns.length === 0) {
      console.log('No campaigns found for this ad account.');
      return;
    }
    
    console.log(`\nFound ${campaigns.length} campaign(s):\n`);
    
    // Display available campaigns
    campaigns.forEach((campaign: any, index: number) => {
      console.log(`${index + 1}. ID: ${campaign.id.replace('act_', '')}`);
      console.log(`   Name: ${campaign.name}`);
      console.log(`   Status: ${campaign.status}`);
      console.log(`   Objective: ${campaign.objective}`);
      
      if (campaign.created_time) {
        console.log(`   Created: ${new Date(campaign.created_time).toLocaleDateString()}`);
      }
      
      if (campaign.spend_cap) {
        console.log(`   Spend Cap: ${campaign.spend_cap}`);
      }
      
      console.log('');
    });
  } catch (error) {
    console.error('Unexpected error during API call:', error);
    process.exit(1);
  }
};

listCampaigns().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 