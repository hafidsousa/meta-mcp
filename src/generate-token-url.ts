/**
 * Generate Facebook Login URL for obtaining access tokens
 * 
 * Usage: npm run generate-token-url
 * 
 * This script generates a URL that users can visit to authorize your app
 * and obtain an access token with the required permissions for Facebook Marketing API.
 */

import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

// Get app ID from .env or use command line argument
const appId = process.env.FB_APP_ID || process.argv[2];

if (!appId) {
  console.error('Error: FB_APP_ID is required. Please set it in your .env file or provide it as an argument.');
  console.error('Usage: npm run generate-token-url');
  console.error('   or: npm run generate-token-url YOUR_APP_ID');
  process.exit(1);
}

// Marketing API permissions needed
const permissions = [
  'ads_management',
  'ads_read',
  'business_management',
  'public_profile'
];

// OAuth redirect URL - ideally should be HTTPS in production
// For development, you can use https://developers.facebook.com/tools/explorer/
const redirectUri = 'https://developers.facebook.com/tools/explorer/';

// Generate the Facebook Login URL
const loginUrl = `https://www.facebook.com/v22.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${permissions.join(',')}&response_type=token`;

console.log('\nFacebook Login URL for Access Token Generation:\n');
console.log(loginUrl);
console.log('\nInstructions:');
console.log('1. Visit the URL above in your browser');
console.log('2. Authorize the requested permissions');
console.log('3. After authorization, you will be redirected to a URL containing your access token');
console.log('4. Copy the access token from the URL (parameter after "access_token=" and before "&")');
console.log('5. Add this token to your .env file as FB_ACCESS_TOKEN\n');

// Alternative methods
console.log('Alternative methods:');
console.log('- Visit: https://developers.facebook.com/tools/explorer/');
console.log('- Select your app from the dropdown');
console.log('- Request the necessary permissions (ads_management, ads_read)');
console.log('- Click "Generate Access Token"\n'); 