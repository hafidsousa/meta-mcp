/**
 * Script to create a Facebook Ad Campaign
 * 
 * Usage:
 *   npx ts-node src/scripts/create-campaign.ts
 * 
 * Environment variables:
 *   FB_ACCESS_TOKEN - Facebook API access token
 *   FB_AD_ACCOUNT_ID - Facebook Ad Account ID
 * 
 * This script creates a campaign with comprehensive settings.
 * Customize the campaignConfig object below to adjust objective, budget, etc.
 * 
 * @see https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group
 */

import { fbConfig } from '../config';
import { FacebookMarketingClient } from '../client';
import { 
  CampaignConfig, 
  CampaignResponse, 
  CampaignObjective, 
  CampaignStatus, 
  BidStrategy,
} from '..';

// Create a client instance
const client = new FacebookMarketingClient(fbConfig);

// Current date for the campaign name
const dateStr = new Date().toISOString().split('T')[0];

// Create a properly structured campaign configuration
const campaignConfig: CampaignConfig = {
  // Format: [Objective]-[Target]-[Date]
  name: `OUTCOME_SALES-NewCustomers-${dateStr}`,
  
  // Campaign settings (required fields)
  objective: CampaignObjective.OUTCOME_SALES, // Options from enum: OUTCOME_SALES, OUTCOME_TRAFFIC, OUTCOME_ENGAGEMENT, etc.
  status: CampaignStatus.PAUSED, // Options from enum: ACTIVE, PAUSED, DELETED, ARCHIVED
  
  // Special ad categories for regulated industries (required by Facebook for certain industries)
  // Leave empty array for regular campaigns with no special ad categories
  // specialAdCategories: [], // Options from enum: EMPLOYMENT, HOUSING, CREDIT, ISSUES_ELECTIONS_POLITICS, NONE
  
  // Budget settings (must use either dailyBudget or lifetimeBudget, not both)
  dailyBudget: 5000, // $50.00 (in cents)
  // lifetimeBudget: 100000, // $1,000.00 (in cents) - Don't use with dailyBudget
  
  // Scheduling settings
  startTime: new Date(Date.now() + 86400000).toISOString(), // Start tomorrow
  // stopTime: new Date(Date.now() + 30 * 86400000).toISOString(), // Required if using lifetimeBudget
  
  // Bidding settings
  bidStrategy: BidStrategy.LOWEST_COST_WITHOUT_CAP, // Options from enum: LOWEST_COST_WITHOUT_CAP, LOWEST_COST_WITH_BID_CAP, COST_CAP, LOWEST_COST_WITH_MIN_ROAS
  
  // Campaign budget optimization - automatically distributes budget across ad sets
  campaignBudgetOptimization: true,
  
  // Optional settings
  // spendCap: 200000, // Campaign spend cap in cents ($2,000.00)
  // minRoasTargetValue: 3.0, // Minimum ROAS target value - Only use with bidStrategy LOWEST_COST_WITH_MIN_ROAS
  
  // Ad Labels for organization
  // adLabels: [{ name: 'Q4_2023' }, { name: 'ProductLaunch' }],
  
  // Boosted object (for boost-type campaigns)
  // boostedObjectId: '123456789', // ID of the post, page, etc. being boosted
  
  // Source campaign
  // source_campaign_id: '123456789', // Original campaign ID if this is a duplicate
  
  // Promoted object (additional specifications for certain campaign objectives)
  // promotedObject: {
  //   pageId: '123456789', // Page ID for the campaign
  //   pixelId: '987654321', // Pixel ID for conversion tracking
  //   // Other fields available: applicationId, objectStoreUrl, customEventType, 
  //   // offerId, productSetId, productCatalogId, placePageSetId
  // },
  
  // Advanced settings
  // useDefaultBuyingType: true, // Whether to use default buying type
  // isSkadnetworkAttribution: false, // For iOS app campaigns
};

/**
 * Creates a Facebook campaign using the specified configuration
 */
async function createCampaign(): Promise<void> {
  try {
    console.log('Creating campaign with config:', JSON.stringify(campaignConfig, null, 2));
    
    // Make the API request to create the campaign
    const response: CampaignResponse = await client.createCampaign(campaignConfig);
    
    // Handle the response
    if (response && response.id) {
      console.log('✅ Campaign created successfully!');
      console.log('Campaign ID:', response.id);
      console.log('Campaign details:', JSON.stringify(response, null, 2));
      
      console.log('\nNext steps:');
      console.log('1. Create ad sets for this campaign:');
      console.log(`   FB_CAMPAIGN_ID=${response.id} npx ts-node src/scripts/create-adset.ts`);
      console.log('2. View the campaign in Facebook Ads Manager');
    } else {
      console.error('❌ Campaign creation failed - no ID returned');
      console.error('Response:', JSON.stringify(response, null, 2));
    }
  } catch (error) {
    console.error('❌ Error creating campaign:');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

// Execute the function
createCampaign().then(() => {
  console.log('Script execution completed');
}).catch(error => {
  console.error('Fatal error in script execution:', error);
  process.exit(1);
}); 