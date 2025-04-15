/**
 * @fileoverview Error mapping for Facebook Marketing API errors
 * Maps Facebook API error codes to human-readable messages
 */

interface ErrorMapping {
  code: string | number;
  message: string;
  suggestion?: string;
}

/**
 * Facebook API error code mappings with human-readable messages and suggestions
 */
export const FacebookErrorMap: Record<string, ErrorMapping> = {
  // Authentication errors
  "190": {
    code: 190,
    message: "Invalid or expired access token",
    suggestion: "Generate a new access token with the required permissions"
  },
  "200": {
    code: 200,
    message: "Permission error",
    suggestion: "Ensure your app has the necessary permissions to perform this action"
  },
  "4": {
    code: 4,
    message: "Application request limit reached",
    suggestion: "Implement rate limiting or try again later"
  },
  "10": {
    code: 10,
    message: "API rate limit exceeded",
    suggestion: "Implement exponential backoff in your requests"
  },
  "17": {
    code: 17,
    message: "User request limit reached",
    suggestion: "Reduce the frequency of requests or optimize your code"
  },
  
  // Ad Account errors
  "1487188": {
    code: 1487188,
    message: "Ad account disabled",
    suggestion: "Check your ad account status in Facebook Business Manager"
  },
  "1815973": {
    code: 1815973,
    message: "Ad account has reached its spend limit",
    suggestion: "Increase your account spend limit in Facebook Business Manager"
  },
  "1815941": {
    code: 1815941,
    message: "Funding source not active",
    suggestion: "Update payment method in Facebook Business Manager"
  },
  
  // Campaign errors
  "100": {
    code: 100,
    message: "Invalid parameter",
    suggestion: "Check parameter values against Facebook Marketing API documentation"
  },
  "1487338": {
    code: 1487338,
    message: "Campaign group already exists with this name",
    suggestion: "Use a different campaign name"
  },
  "1391835": {
    code: 1391835,
    message: "Missing or invalid objective",
    suggestion: "Provide a valid campaign objective from the allowed list"
  },
  "1811500": {
    code: 1811500,
    message: "Invalid special ad category",
    suggestion: "Provide a valid special ad category value"
  },
  
  // Ad Set errors
  "1487342": {
    code: 1487342,
    message: "Ad set already exists with this name",
    suggestion: "Use a different ad set name"
  },
  "1479195": {
    code: 1479195,
    message: "Invalid targeting spec",
    suggestion: "Check targeting specifications against API documentation"
  },
  "1487171": {
    code: 1487171,
    message: "Invalid optimization goal and billing event combination",
    suggestion: "Use a compatible combination of optimization goal and billing event"
  },
  "1487283": {
    code: 1487283,
    message: "Invalid bid amount for the selected bid strategy",
    suggestion: "Adjust bid amount according to bid strategy requirements"
  },
  
  // Ad errors
  "1487321": {
    code: 1487321,
    message: "Ad creative not approved",
    suggestion: "Review Facebook's ad policies and adjust your creative"
  },
  "1487301": {
    code: 1487301,
    message: "Missing or invalid creative",
    suggestion: "Provide a complete and valid creative for the ad"
  },
  "1487383": {
    code: 1487383,
    message: "Ad has already been used",
    suggestion: "Create a new ad creative or use a different creative ID"
  },
  
  // General errors
  "1": {
    code: 1,
    message: "Unknown error",
    suggestion: "Check server logs for more details"
  },
  "2": {
    code: 2,
    message: "Service temporarily unavailable",
    suggestion: "Try again later"
  },
  "3": {
    code: 3,
    message: "Unknown method",
    suggestion: "Check method name in your API call"
  },
  "368": {
    code: 368,
    message: "The action attempted has been deemed abusive or is otherwise disallowed",
    suggestion: "Review Facebook's platform policies"
  }
};

/**
 * Gets a human-readable message for a Facebook API error code
 * @param code Facebook API error code
 * @returns Human-readable error message with suggestion
 */
export function getFacebookErrorMessage(code: string | number): string {
  const errorCode = String(code);
  const mapping = FacebookErrorMap[errorCode];
  
  if (mapping) {
    return `${mapping.message}. ${mapping.suggestion || ''}`;
  }
  
  return `Facebook API error (code ${code}). Check API documentation for details.`;
}

/**
 * Gets the full error mapping for a Facebook API error code
 * @param code Facebook API error code
 * @returns Error mapping or undefined if not found
 */
export function getFacebookErrorMapping(code: string | number): ErrorMapping | undefined {
  const errorCode = String(code);
  return FacebookErrorMap[errorCode];
} 