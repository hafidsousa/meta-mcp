import { config as loadEnv } from 'dotenv';
import { getAllTools } from '../../tools';
import { CREATE_CAMPAIGN_TOOL, GET_CAMPAIGNS_TOOL } from '../../tools/campaign';

// Load environment variables
loadEnv();

// Check for required environment variables
const accessToken = process.env.FB_ACCESS_TOKEN;
const adAccountId = process.env.FB_AD_ACCOUNT_ID;

if (!accessToken) {
  console.error('Error: FB_ACCESS_TOKEN is required. Please set it in your .env file.');
  process.exit(1);
}

if (!adAccountId) {
  console.error('Error: FB_AD_ACCOUNT_ID is required. Please set it in your .env file.');
  process.exit(1);
}

/**
 * Format a schema property for JSON output
 */
function formatPropertyToJson(property: any, key = ''): any {
  const result: any = {};
  
  // Basic metadata
  if (property.type) {
    result.type = property.type;
  }
  
  if (property.description) {
    result.description = property.description;
  }
  
  // Constraints
  if (property.minimum !== undefined) {
    result.minimum = property.minimum;
  }
  
  if (property.maximum !== undefined) {
    result.maximum = property.maximum;
  }
  
  if (property.default !== undefined) {
    result.default = property.default;
  }
  
  // Enum values
  if (property.enum) {
    result.enum = property.enum;
  }
  
  // Required fields
  if (property.required && property.required.length > 0) {
    result.required = property.required;
  }
  
  // Properties for objects
  if (property.properties) {
    result.properties = {};
    for (const [propKey, propValue] of Object.entries(property.properties)) {
      result.properties[propKey] = formatPropertyToJson(propValue, propKey);
    }
  }
  
  // Items for arrays
  if (property.items) {
    result.items = formatPropertyToJson(property.items);
  }
  
  return result;
}

/**
 * Convert tool schema to JSON format
 */
function toolSchemaToJson(tool: any): any {
  const result: any = {
    name: tool.name,
    description: tool.description,
    inputSchema: {}
  };
  
  // Get root properties
  const properties = tool.inputSchema?.properties || {};
  
  // Format each property
  result.inputSchema.properties = {};
  for (const [key, value] of Object.entries(properties)) {
    result.inputSchema.properties[key] = formatPropertyToJson(value, key);
  }
  
  // Required fields at root level
  if (tool.inputSchema?.required?.length > 0) {
    result.inputSchema.required = tool.inputSchema.required;
  }
  
  return result;
}

// Build combined JSON output
const output = {
  campaign_tools: {
    createCampaign: toolSchemaToJson(CREATE_CAMPAIGN_TOOL),
    getCampaigns: toolSchemaToJson(GET_CAMPAIGNS_TOOL)
  },
  metadata: {
    naming_convention: "snake_case",
    api_origin: "Facebook Marketing API"
  }
};

// Output as JSON
console.log(JSON.stringify(output, null, 2)); 