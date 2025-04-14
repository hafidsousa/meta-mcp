#!/usr/bin/env node

import { FacebookMarketingClient } from './client';
import { CampaignConfig, AdSetConfig, AdConfig, FacebookConfig } from './types';
import { config as loadEnv } from 'dotenv';

// Load environment variables
loadEnv();

/**
 * Custom logger that writes to stderr to avoid mixing logs with JSON responses
 * @param message Message to log
 */
function log(message: string) {
  process.stderr.write(`${message}\n`);
}

// Initialize Facebook client with environment variables
const fbConfig: FacebookConfig = {
  adAccountId: process.env.FB_AD_ACCOUNT_ID || '',
  accessToken: process.env.FB_ACCESS_TOKEN || '',
  appId: process.env.FB_APP_ID || '',
  appSecret: process.env.FB_APP_SECRET || ''
};

const client = new FacebookMarketingClient(fbConfig);

export const createCampaign = async (params: { config: Partial<CampaignConfig> }) => {
  return client.createCampaign(params.config as CampaignConfig);
};

export const createAdSet = async (params: { config: Partial<AdSetConfig> }) => {
  return client.createAdSet(params.config);
};

export const createAd = async (params: { config: AdConfig }) => {
  return client.createAd(params.config);
};

export const getAdSets = async (params: { campaignId: string }) => {
  return client.getAdSets(params.campaignId);
};

export const getAds = async (params: { adSetId: string }) => {
  return client.getAds(params.adSetId);
};

export const pauseCampaign = async (params: { campaignId: string }) => {
  return client.pauseCampaign(params.campaignId);
};

export const pauseAdSet = async (params: { adSetId: string }) => {
  return client.pauseAdSet(params.adSetId);
};

export const pauseAd = async (params: { adId: string }) => {
  return client.pauseAd(params.adId);
};

export const getAvailableAdAccounts = async () => {
  return client.getAvailableAdAccounts();
};

export const getCampaigns = async () => {
  return client.getCampaigns();
};

// MCP Server initialization
if (require.main === module) {
  // This code executes when the script is run directly
  
  // Check if the required environment variables are set
  if (!fbConfig.accessToken) {
    log('Error: FB_ACCESS_TOKEN environment variable is required');
    process.exit(1);
  }

  if (!fbConfig.adAccountId) {
    log('Error: FB_AD_ACCOUNT_ID environment variable is required');
    process.exit(1);
  }

  log('Starting Meta MCP Server...');
  log(`Using Ad Account ID: ${fbConfig.adAccountId}`);

  // Override console.log to use stderr for MCP server
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    log(args.join(' '));
  };

  // Set up the MCP communication (STDIO transport)
  process.stdin.setEncoding('utf-8');
  
  let buffer = '';
  
  process.stdin.on('data', async (data) => {
    buffer += data.toString();
    
    // Process complete JSON messages
    let newlineIndex;
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      const message = buffer.slice(0, newlineIndex);
      buffer = buffer.slice(newlineIndex + 1);
      
      let request: { id?: number | string, method?: string, params?: any } = {};
      
      try {
        request = JSON.parse(message);
        const { id, method, params } = request;
        
        log(`Received request ${id}: ${method}`);
        
        let result;
        
        // Execute the requested method
        switch (method) {
          case 'createCampaign':
            result = await createCampaign(params);
            break;
          case 'createAdSet':
            result = await createAdSet(params);
            break;
          case 'createAd':
            result = await createAd(params);
            break;
          case 'getAdSets':
            result = await getAdSets(params);
            break;
          case 'getAds':
            result = await getAds(params);
            break;
          case 'pauseCampaign':
            result = await pauseCampaign(params);
            break;
          case 'pauseAdSet':
            result = await pauseAdSet(params);
            break;
          case 'pauseAd':
            result = await pauseAd(params);
            break;
          case 'getAvailableAdAccounts':
            result = await getAvailableAdAccounts();
            break;
          case 'getCampaigns':
            result = await getCampaigns();
            break;
          default:
            throw new Error(`Unknown method: ${method}`);
        }
        
        // Send the response
        const response = {
          id,
          result,
          jsonrpc: '2.0'
        };
        
        process.stdout.write(JSON.stringify(response) + '\n');
      } catch (error) {
        // Handle errors
        const errorResponse = {
          id: request?.id || null,
          error: {
            code: -32000,
            message: error instanceof Error ? error.message : 'Unknown error'
          },
          jsonrpc: '2.0'
        };
        
        process.stdout.write(JSON.stringify(errorResponse) + '\n');
      }
    }
  });

  // Send initial ready signal
  const readyMessage = {
    jsonrpc: '2.0',
    method: 'ready',
    params: { version: '1.0.0' }
  };
  process.stdout.write(JSON.stringify(readyMessage) + '\n');
  
  // Handle exit signals
  process.on('SIGINT', () => {
    log('Shutting down...');
    process.exit(0);
  });
} 