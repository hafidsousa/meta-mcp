/**
 * @fileoverview Simple error class for Facebook Marketing API
 * 
 * This is a pass-through error class that directly forwards Facebook API errors
 * without complex mapping or transformation.
 */

export class FacebookMarketingError extends Error {
  constructor(
    message: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'FacebookMarketingError';
  }
}

export const ErrorCodes = {
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const; 