export class FacebookMarketingError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown,
    public errorDetails?: Record<string, any> | null
  ) {
    super(message);
    this.name = 'FacebookMarketingError';
  }
}

export const ErrorCodes = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  API_ERROR: 'API_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
} as const; 