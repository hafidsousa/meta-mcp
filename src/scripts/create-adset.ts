/**
 * Script to create a Facebook Ad Set
 * 
 * Usage:
 *   npx ts-node src/scripts/create-adset.ts
 * 
 * Environment variables:
 *   FB_ACCESS_TOKEN - Facebook API access token
 *   FB_AD_ACCOUNT_ID - Facebook Ad Account ID
 *   FB_CAMPAIGN_ID - Optional campaign ID to override the default
 * 
 * This script creates an ad set with comprehensive settings.
 * Customize the adSetConfig object below to adjust targeting, budget, etc.
 */

import { fbConfig } from '../config';
import { FacebookMarketingClient } from '../client';
import { AdSetConfig, AdSetResponse } from '../types';

// Create a client instance
const client = new FacebookMarketingClient(fbConfig);

// Campaign ID to add the ad set to - Replace with a valid campaign ID
const campaignId = process.env.FB_CAMPAIGN_ID || '6754818280499';

// Current date for the ad set name
const dateStr = new Date().toISOString().split('T')[0];

// Create a properly structured ad set configuration
const adSetConfig: AdSetConfig = {
  // Format: [Target Audience]-[Placement]-[Date]
  name: `AudienceTarget-SocialPlacements-${dateStr}`,
  campaignId: campaignId,
  status: 'PAUSED', // Options: 'ACTIVE', 'PAUSED'
  
  // Budget settings (use either dailyBudget or lifetimeBudget, not both)
  // dailyBudget: 5000, // $50.00 (in cents) - Removed because the campaign has CBO enabled
  // lifetimeBudget: 100000, // $1,000.00 (in cents) - Don't use with dailyBudget
  
  // Schedule settings
  startTime: new Date(Date.now() + 86400000).toISOString(), // Start tomorrow
  endTime: new Date(Date.now() + 30 * 86400000).toISOString(), // Run for 30 days
  
  // Bidding settings
  bidStrategy: 'LOWEST_COST_WITHOUT_CAP', // Options: 'LOWEST_COST_WITHOUT_CAP', 'LOWEST_COST_WITH_BID_CAP', 'COST_CAP'
  // bidAmount: 1000, // $10.00 (in cents) - Only use with bidStrategy 'LOWEST_COST_WITH_BID_CAP' or 'COST_CAP'
  
  // Billing and optimization
  billingEvent: 'IMPRESSIONS', // Switched back to IMPRESSIONS billing
  optimizationGoal: 'REACH', // Using REACH which is often available for new accounts
  
  // Attribution settings - controls how conversions are attributed
  // Removing the attributionSpec that was causing errors
  // attributionSpec: [
  //   {
  //     eventType: 'CLICK',
  //     windowDays: 7
  //   },
  //   {
  //     eventType: 'VIEW',
  //     windowDays: 1
  //   }
  // ],
  
  // Pacing type - how budget is spent throughout the day
  pacingType: ['standard'],
  
  // Promoted object - required for some campaign types
  // promotedObject: {
  //   pageId: '123456789', // Facebook Page ID - replace with valid ID
  //   pixelId: '987654321', // Facebook Pixel ID for conversion tracking - replace with valid ID
  // },
  
  // Comprehensive targeting options
  targeting: {
    // Geographic targeting
    geoLocations: {
      countries: ['AU'],
      // regions: [{ key: '3847' }], // State/province targeting - replace with valid region key
      // cities: [{ key: '2418779', radius: 50, distance_unit: 'mile' }], // City targeting - replace with valid city key
      // zips: [{ key: '94025' }], // ZIP/postal code targeting - replace with valid postal code
    },
    
    // Demographic targeting
    ageMin: 25,
    ageMax: 54,
    genders: [2], // 1=male, 2=female, [1,2]=all genders
    locales: [6], // 6 = English
    
    // Platform and placement targeting
    publisherPlatforms: ['facebook', 'instagram'], // Options: 'facebook', 'instagram', 'audience_network', 'messenger'
    facebookPositions: ['feed', 'story'], // Where ads appear on Facebook
    instagramPositions: ['stream', 'story', 'explore'], // Where ads appear on Instagram
    
    // Device targeting
    devicePlatforms: ['mobile', 'desktop'],
    userOs: ['iOS', 'Android'],
    
    // Interest and behavior targeting - comment out if you don't have verified valid IDs
    // interests: [
    //   { id: '6003107902990', name: 'Skincare' } // Replace with valid interest ID
    // ],
    // behaviors: [
    //   { id: '6002714895372', name: 'Frequent traveler' } // Replace with valid behavior ID
    // ],
    
    // Exclusions - people to exclude from targeting
    // exclusions: {
    //   interests: [
    //     { id: '6003139266461', name: 'Competitor product' } // Replace with valid interest ID
    //   ]
    // },
    
    // Custom audiences - comment out unless you have valid custom audience IDs
    // customAudiences: [
    //   { id: '12345678', name: 'Website visitors' } // Replace with valid custom audience ID
    // ],
    
    // Flexible targeting with AND/OR logic - comment out unless you have valid IDs
    // flexibleSpec: [
    //   { interests: [{ id: '123', name: 'Interest 1' }] }, // Replace with valid interest IDs
    //   { interests: [{ id: '456', name: 'Interest 2' }] }
    // ]
  },
  
  // Optional: Ad scheduling (time-based)
  adSchedules: [
    {
      days: [1, 2, 3, 4, 5], // Monday to Friday
      hours: [9, 10, 11, 12, 13, 14, 15, 16, 17], // 9am to 5pm
      minutes: [0] // On the hour
    }
  ]
};

// Function to create the ad set
async function createAdSet(): Promise<void> {
  try {
    console.log('Creating ad set with the following configuration:');
    console.log(JSON.stringify(adSetConfig, null, 2));
    
    console.log('\nSending request to Facebook Marketing API...');
    const response: AdSetResponse = await client.createAdSet(adSetConfig);
    
    if (response && response.success && response.id) {
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
      
      // Display detailed error information if available
      if (response?.error?.details) {
        console.error('\nDetailed Error Information:');
        console.error(JSON.stringify(response.error.details, null, 2));
      }
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