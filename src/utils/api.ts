/**
 * @fileoverview API utilities for Facebook Marketing API
 */

import { FacebookMarketingError, ErrorCodes } from '../errors';
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
    
    const data = await response.json() as any;
    
    if (!response.ok || data.error) {
      log(`API Error response: ${JSON.stringify(data)}`);
      
      // Extract detailed error information
      const errorMessage = data.error?.message || 
                           data.error_description ||
                           data.error_msg ||
                           data.error_message || 
                           `API request failed with status ${response.status}`;
      
      // Create an error with additional information from Facebook
      const error = new Error(errorMessage);
      
      // Attach the full error response for better debugging
      (error as any).fbErrorResponse = data.error || data;
      (error as any).httpStatus = response.status;
      
      throw error;
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
    log(`Error in operation "${operation}": ${error.message}`);
    
    // Extract Facebook API error details
    let errorMessage = `Error during ${operation}`;
    let errorDetails: Record<string, any> | null = null;
    let errorCode: keyof typeof ErrorCodes = 'API_ERROR';
    
    // Check if we have enhanced error information from our apiRequest function
    if ((error as any).fbErrorResponse) {
      const fbError = (error as any).fbErrorResponse;
      errorDetails = {
        fb_error: fbError,
        http_status: (error as any).httpStatus,
        fb_code: undefined,
        fb_subcode: undefined
      };
      
      // Extract Facebook error code if available
      if (fbError.code) {
        errorDetails.fb_code = fbError.code;
      }
      // Extract error subcode if available
      if (fbError.error_subcode) {
        errorDetails.fb_subcode = fbError.error_subcode;
      }
    }
    // Check if the error has the Facebook API error format with code in parentheses
    else if (error.message.includes('(#')) {
      // Extract error code if it's in the format (#123)
      const codeMatch = error.message.match(/\(#(\d+)\)/);
      if (codeMatch && codeMatch[1]) {
        errorDetails = {
          fb_code: codeMatch[1],
          fb_message: error.message
        };
      }
    }
    
    // Handle rate limiting
    if (error.message.includes('rate limit')) {
      errorCode = 'RATE_LIMIT';
      errorMessage = `Rate limit exceeded during ${operation}`;
    }
    // Handle network errors
    else if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
      errorCode = 'NETWORK_ERROR';
      errorMessage = `Network error during ${operation}`;
    }
    // Handle validation errors
    else if (error.message.includes('required') || error.message.includes('invalid') || error.message.includes('must be')) {
      errorCode = 'VALIDATION_ERROR';
      errorMessage = `Validation error during ${operation}`;
    }
    
    // Add original Facebook error message to our error
    if (error.message) {
      errorMessage = `${errorMessage}: ${error.message}`;
    }
    
    throw new FacebookMarketingError(
      errorMessage,
      ErrorCodes[errorCode],
      error,
      errorDetails
    );
  }

  // Generic API error
  throw new FacebookMarketingError(
    `Error during ${operation}`,
    ErrorCodes.API_ERROR,
    error
  );
} 