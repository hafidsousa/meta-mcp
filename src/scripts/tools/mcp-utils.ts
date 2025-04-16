/**
 * @fileoverview MCP (Meta Client Platform) utilities for Facebook Marketing
 */

import { FB_API_VERSION } from '../../config';

/**
 * Fetches available ad accounts using the Facebook Graph API
 * @param accessToken User's access token
 * @returns An array of ad account objects
 */
export const fetchAdAccounts = async (accessToken: string) => {
  console.log('Fetching ad accounts from Graph API...');
  
  try {
    const url = `https://graph.facebook.com/${FB_API_VERSION}/me/adaccounts`;
    const params = {
      fields: 'name,account_id,account_status,amount_spent,currency',
      access_token: accessToken
    };
    
    // Build the query string
    const queryString = new URLSearchParams(params).toString();
    
    // Make the API call
    const response = await fetch(`${url}?${queryString}`);
    const data = await response.json() as any;
    
    console.log('Response received from Facebook Graph API');
    console.log('Accounts found:', data.data?.length || 0);
    
    return {
      success: true,
      accounts: data.data || []
    };
  } catch (error) {
    console.error('Error fetching ad accounts:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      accounts: []
    };
  }
};

/**
 * Helper to extract the numeric ad account ID from the format returned by the API
 * @param fullAccountId Account ID with 'act_' prefix
 * @returns Clean account ID without prefix
 */
export const extractAdAccountId = (fullAccountId: string): string => {
  return fullAccountId.replace('act_', '');
}; 