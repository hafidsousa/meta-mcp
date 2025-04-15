/**
 * @fileoverview API utilities for Facebook Marketing API
 */

import { FacebookMarketingError, ErrorCodes } from '../errors';

/**
 * Makes a Graph API request
 * @param baseUrl Base URL for the API
 * @param path API endpoint path
 * @param accessToken Facebook access token
 * @param method HTTP method
 * @param params Request parameters
 * @returns Promise with API response
 */
export async function apiRequest<T>(
  baseUrl: string,
  path: string, 
  accessToken: string,
  method: 'GET' | 'POST' | 'DELETE' = 'GET', 
  params: Record<string, any> = {}
): Promise<T> {
  try {
    // Always include access token
    params.access_token = accessToken;
    
    const url = `${baseUrl}/${path}`;
    let response;
    
    console.log(`Making ${method} request to: ${url}`);
    
    if (method === 'GET') {
      // For GET requests, append params to URL
      const queryParams: Record<string, string> = {};
      
      // Convert all values to strings
      Object.entries(params).forEach(([key, value]) => {
        if (typeof value === 'object') {
          queryParams[key] = JSON.stringify(value);
        } else {
          queryParams[key] = String(value);
        }
      });
      
      const queryString = new URLSearchParams(queryParams).toString();
      console.log(`GET params: ${queryString}`);
      response = await fetch(`${url}?${queryString}`);
    } else {
      // For POST/DELETE, use request body
      const body = new URLSearchParams();
      
      for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'object') {
          body.append(key, JSON.stringify(value));
        } else {
          body.append(key, String(value));
        }
      }
      
      console.log(`${method} params: `, Object.fromEntries(body.entries()));
      
      response = await fetch(url, {
        method,
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
    }
    
    const data = await response.json() as any;
    
    if (!response.ok || data.error) {
      console.error(`API Error response:`, data);
      throw new Error(
        data.error?.message || 
        data.error_description ||
        data.error_msg ||
        data.error_message || 
        `API request failed with status ${response.status}`
      );
    }
    
    return data as T;
  } catch (error) {
    handleApiError(error, `${method} ${path}`);
    throw error; // This will never execute due to handleApiError, but needed for TypeScript
  }
}

/**
 * Handles API errors and throws standardized exceptions
 * @param error The error object
 * @param operation Description of the failed operation
 */
export function handleApiError(error: unknown, operation: string): never {
  if (error instanceof Error) {
    console.error(`Error in operation "${operation}": ${error.message}`);
    
    // Handle rate limiting
    if (error.message.includes('rate limit')) {
      throw new FacebookMarketingError(
        `Rate limit exceeded during ${operation}`,
        ErrorCodes.RATE_LIMIT,
        error
      );
    }
    
    // Handle network errors
    if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
      throw new FacebookMarketingError(
        `Network error during ${operation}`,
        ErrorCodes.NETWORK_ERROR,
        error
      );
    }
  }

  // Generic API error
  throw new FacebookMarketingError(
    `Error during ${operation}`,
    ErrorCodes.API_ERROR,
    error
  );
} 