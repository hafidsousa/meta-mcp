/**
 * Script to create a Facebook Ad
 * 
 * Usage:
 *   npx ts-node src/scripts/create-ad.ts
 * 
 * Environment variables:
 *   FB_ACCESS_TOKEN - Facebook API access token
 *   FB_AD_ACCOUNT_ID - Facebook Ad Account ID
 *   FB_ADSET_ID - Optional ad set ID to override the default
 *   FB_PAGE_ID - Facebook Page ID
 * 
 * This script creates an ad with comprehensive settings.
 * Customize the adConfig object below to adjust creative, text, and other ad properties.
 */

import { fbConfig } from '../config';
import { FacebookMarketingClient } from '../client';
import { AdConfig, AdResponse } from '../types';

// Create a client instance
const client = new FacebookMarketingClient(fbConfig);

// Ad Set ID to add the ad to - Replace with a valid ad set ID
// Using format: 23849216708330398
const adSetId = process.env.FB_ADSET_ID || '120221399185700774';

// Facebook Page ID - Get from environment
const pageId = process.env.FB_PAGE_ID || '518324775326571'; // Use environment variable with fallback

// Debug logging
console.log(`Using Page ID: ${pageId}`);

// Current date for the ad name
const dateStr = new Date().toISOString().split('T')[0];

// Create a properly structured ad configuration
const adConfig: AdConfig = {
  // Format: [Creative Type]-[Offer]-[Date]
  name: `Simple-Ad-${dateStr}`,
  adsetId: adSetId,
  status: 'PAUSED', // Options: 'ACTIVE', 'PAUSED'
  
  // Creative configuration - simplified to minimum required fields
  creative: {
    title: 'Simple Ad Title',
    body: 'Simple ad description text.',
    linkUrl: 'https://www.example.com',
    imageUrl: 'https://fastly.picsum.photos/id/237/500/500.jpg',
    
    // Simplified object story spec
    objectStorySpec: {
      pageId: pageId,
      linkData: {
        link: 'https://www.example.com',
        message: 'Check out our website',
        name: 'Simple Ad'
      }
    },
    
    // Simple creative name
    name: `Basic-Creative-${dateStr}`
  }
  
  // Removed tracking specifications and other optional fields that might require additional permissions
};

// Function to create the ad
async function createAd(): Promise<void> {
  try {
    console.log('Creating ad with the following configuration:');
    console.log(JSON.stringify(adConfig, null, 2));
    
    // Extra debug for page ID
    console.log(`\nConfirming Page ID: ${pageId}`);
    console.log(`Object Story Spec Page ID: ${adConfig.creative.objectStorySpec?.pageId}`);
    
    console.log('\nSending request to Facebook Marketing API...');
    const response: AdResponse = await client.createAd(adConfig);
    
    if (response && response.success && response.id) {
      console.log('\nAd created successfully!');
      console.log('Ad ID:', response.id);
      
      // Display ad details
      console.log('\nAd Details:');
      console.log('Name:', response.data?.name);
      console.log('Status:', response.data?.status);
      console.log('Ad Set ID:', response.data?.adset_id);
      
      // Get full ad details
      console.log('\nRetrieving complete ad details...');
      const ad = await client.getAd(response.id);
      console.log('Full Ad Details:', JSON.stringify(ad, null, 2));
    } else {
      console.error('Failed to create ad:', response?.error || 'Unknown error');
      
      // Display detailed error information if available
      if (response?.error?.details) {
        console.error('\nDetailed Error Information:');
        console.error(JSON.stringify(response.error.details, null, 2));
      }
    }
  } catch (error) {
    console.error('Error creating ad:');
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
createAd(); 