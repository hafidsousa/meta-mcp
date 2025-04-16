import { config as loadEnv } from 'dotenv';
import { getAllTools } from '../../tools';

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

// Get and output all available tools as JSON
const listTools = () => {
  const tools = getAllTools();
  
  const toolsOutput = tools.map((tool, index) => {
    // Extract parameters
    const params = tool.inputSchema?.properties || {};
    
    const parameters = Object.entries(params).reduce((acc, [key, value]) => {
      // @ts-ignore
      acc[key] = { description: value.description || 'No description' };
      return acc;
    }, {});
    
    return {
      id: index + 1,
      name: tool.name,
      description: tool.description,
      parameters: Object.keys(params).length > 0 ? parameters : null
    };
  });
  
  console.log(JSON.stringify(toolsOutput, null, 2));
};

listTools(); 