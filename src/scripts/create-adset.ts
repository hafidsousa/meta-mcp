/**
 * Script to create a Facebook Ad Set
 * 
 * Usage:
 *   npx ts-node src/scripts/create-adset.ts
 * 
 * Environment variables:
 *   FB_ACCESS_TOKEN - Facebook API access token
 *   FB_AD_ACCOUNT_ID - Facebook Ad Account ID
 * 
 * This script creates an ad set with default settings.
 * Customize the adSetConfig object below to adjust targeting, budget, etc.
 */

import { fbConfig } from '../config';
import { FacebookMarketingClient } from '../client';
import { AdSetConfig, AdSetResponse } from '../types';

// Create a client instance
const client = new FacebookMarketingClient(fbConfig);

// Campaign ID to add the ad set to - Replace with a valid campaign ID
const campaignId = process.env.FB_CAMPAIGN_ID || '6754919187499';

// Current date for the ad set name
const dateStr = new Date().toISOString().split('T')[0];

// Create a properly structured ad set configuration
const adSetConfig: AdSetConfig = {
  name: `AdSet-${dateStr}`,
  campaignId: campaignId,
  status: 'PAUSED',
  dailyBudget: 2000, // $20.00 (in cents)
  targeting: {
    geoLocations: {
      countries: ['US']
    },
    ageMin: 18,
    ageMax: 65,
    genders: [1, 2], // 1=male, 2=female
    publisherPlatforms: ['facebook'],
    facebookPositions: ['feed']
  },
  optimizationGoal: 'LINK_CLICKS',
  billingEvent: 'IMPRESSIONS',
  bidStrategy: 'LOWEST_COST_WITHOUT_CAP'
};

// Function to create the ad set
async function createAdSet(): Promise<void> {
  try {
    console.log('Creating ad set with the following configuration:');
    console.log(JSON.stringify(adSetConfig, null, 2));
    
    console.log('\nSending request to Facebook Marketing API...');
    const response: AdSetResponse = await client.createAdSet(adSetConfig);
    
    if (response && response.success) {
      console.log('\nAd Set created successfully!');
      console.log('Ad Set ID:', response.id);
      
      // Display ad set details
      console.log('\nAd Set Details:');
      console.log('Name:', response.data?.name);
      console.log('Status:', response.data?.status);
      console.log('Campaign ID:', response.data?.campaign_id);
      
      // Get full ad set details
      console.log('\nRetrieving complete ad set details...');
      const adSet = await client.getAdSet(response.id);
      console.log('Full Ad Set Details:', JSON.stringify(adSet, null, 2));
    } else {
      console.error('Failed to create ad set:', response?.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error creating ad set:');
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      
      // Log nested errors if available
      if ('originalError' in error && (error as any).originalError) {
        console.error('Original error:', (error as any).originalError);
      }
    } else {
      console.error(error);
    }
  }
}

// Execute the function
createAdSet(); 