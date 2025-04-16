/**
 * @fileoverview Account operations for Facebook Marketing API
 * 
 * @note IMPORTANT: This is a pure pass-through proxy. All requests and responses
 * are passed directly to and from the Facebook API without modification.
 * All request payloads must use Facebook API's required formats (snake_case).
 */

import { apiRequest } from '../utils/api';

/**
 * Retrieves available ad accounts for a user
 * @param baseUrl Base URL for the API
 * @param accessToken Facebook access token
 * @returns Promise with user's available ad accounts
 */
export async function getAvailableAdAccounts(
  baseUrl: string,
  accessToken: string
): Promise<any[]> {
  const fields = 'id,name,account_id,account_status,amount_spent,business_name,business,currency,owner,spend_cap,timezone_name,timezone_offset_hours_utc';
  
  const response = await apiRequest(
    baseUrl,
    'me/adaccounts',
    accessToken,
    'GET',
    { fields }
  );
  
  return response.data || [];
} 