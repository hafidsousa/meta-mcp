/**
 * @fileoverview MCP (Meta Client Platform) utilities for Facebook Marketing
 */

import { FacebookAdsApi } from 'facebook-nodejs-business-sdk';

interface AdAccountResponse {
  data: Array<{
    id: string;
    name: string;
    account_status: number;
    amount_spent: string;
    currency: string;
  }>;
}

/**
 * Fetches available ad accounts using MCP tools
 * @param accessToken User's access token
 * @returns An array of ad account objects
 */
export const fetchAdAccounts = async (accessToken: string) => {
  const api = FacebookAdsApi.init(accessToken);
  
  try {
    const response = await api.call<AdAccountResponse>('GET', '/me/adaccounts', {
      fields: ['id', 'name', 'account_status', 'amount_spent', 'currency']
    });
    
    return {
      success: true,
      accounts: response.data || []
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