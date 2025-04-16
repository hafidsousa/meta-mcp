/**
 * Script to list Facebook campaigns
 * 
 * Usage:
 *   npx ts-node src/scripts/list-campaigns.ts
 * 
 * Environment variables:
 *   FB_ACCESS_TOKEN - Facebook API access token
 *   FB_AD_ACCOUNT_ID - Facebook Ad Account ID
 * 
 * This script retrieves and lists all campaigns in the ad account.
 */

import { fbConfig } from '../config';
import { FacebookMarketingClient } from '../client';
import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

// Extract credentials from environment or config
const accessToken = process.env.FB_ACCESS_TOKEN || fbConfig.accessToken;
const adAccountId = process.env.FB_AD_ACCOUNT_ID || fbConfig.adAccountId;

// Create a client instance
const client = new FacebookMarketingClient({
  accessToken,
  adAccountId
});

console.log('Listing campaigns from Facebook Marketing API');
console.log(`Access token starts with: ${accessToken.substring(0, 10)}...`);
console.log(`Using ad account ID: ${adAccountId}`);

const listCampaigns = async () => {
  try {
    // Get all campaigns for the ad account
    const campaigns = await client.getCampaigns();
    
    if (!campaigns || campaigns.length === 0) {
      console.log('No campaigns found for this ad account.');
      return;
    }
    
    console.log(`\nFound ${campaigns.length} campaign(s):\n`);
    
    // Display available campaigns
    campaigns.forEach((campaign: any, index: number) => {
      console.log(`${index + 1}. ID: ${campaign.id}`);
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
  }
};

// Execute the list function
listCampaigns(); 