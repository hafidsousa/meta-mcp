/**
 * @fileoverview Account operations for Facebook Marketing API
 */

import { apiRequest, handleApiError } from '../utils/api';

/**
 * Gets all available ad accounts for the current user
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @returns Promise with list of ad accounts
 */
export async function getAvailableAdAccounts(
  baseUrl: string,
  accessToken: string
): Promise<any[]> {
  try {
    const fields = 'id,name,account_status,amount_spent,currency';
    
    const response = await apiRequest<{data: any[]}>(
      baseUrl,
      'me/adaccounts',
      accessToken,
      'GET',
      { fields }
    );
    
    return response.data || [];
  } catch (error) {
    console.error('Error getting ad accounts:', error);
    handleApiError(error, 'get ad accounts');
    return [];
  }
} 