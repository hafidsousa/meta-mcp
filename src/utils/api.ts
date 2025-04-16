/**
 * @fileoverview API utilities for Facebook Marketing API
 * 
 * @note IMPORTANT: This is a pure pass-through proxy. All requests and responses
 * are passed directly to and from the Facebook API without modification.
 */

import { log } from '../config';

/**
 * Makes a Graph API request
 * @param baseUrl Base URL for the API
 * @param path API endpoint path
 * @param accessToken Facebook access token
 * @param method HTTP method
 * @param params Request parameters
 * @returns Promise with API response
 */
export async function apiRequest(
  baseUrl: string,
  path: string, 
  accessToken: string,
  method: 'GET' | 'POST' | 'DELETE' = 'GET', 
  params: Record<string, any> = {}
): Promise<any> {
  // Always include access token
  params.access_token = accessToken;
  
  const url = `${baseUrl}/${path}`;
  let response;
  
  log(`Making ${method} request to: ${url}`);
  
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
    log(`GET params: ${queryString}`);
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
    
    log(`${method} params: ${JSON.stringify(Object.fromEntries(body.entries()))}`);
    
    response = await fetch(url, {
      method,
      body,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }
  
  // Treat data as any to maintain the pass-through nature
  const data = await response.json() as any;
  
  if (!response.ok || data.error) {
    log(`API Error response: ${JSON.stringify(data)}`);
    
    // Extract error information for better error messages
    const errorMessage = data.error?.message || 
                         data.error_description ||
                         data.error_msg ||
                         data.error_message || 
                         `API request failed with status ${response.status}`;
    
    // Create an error with the Facebook API error message
    const error = new Error(errorMessage);
    
    // Attach the full error response for better debugging
    (error as any).fbErrorResponse = data.error || data;
    (error as any).httpStatus = response.status;
    
    throw error;
  }
  
  return data;
} 