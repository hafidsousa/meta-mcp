/**
 * @fileoverview Tests for tool definitions
 * Uses snapshot testing to ensure tool definitions don't change unintentionally
 */

import { generateAllToolDefinitions } from '../utils/docgen';
import { Tool } from '@modelcontextprotocol/sdk/types.js';

describe('Tool Definitions', () => {
  it('should match the snapshot for all tool definitions', () => {
    const tools = generateAllToolDefinitions();
    
    // This will create a snapshot on first run, and compare on subsequent runs
    expect(tools).toMatchSnapshot();
  });
  
  it('should include all required Facebook Marketing API tools', () => {
    const tools = generateAllToolDefinitions();
    const toolNames = tools.map((tool: Tool) => tool.name);
    
    // Core Facebook Marketing API operations
    const requiredToolNames = [
      'createCampaign',
      'getCampaigns',
      'pauseCampaign',
      'updateCampaign',
      'createAdSet',
      'getAdSets',
      'pauseAdSet',
      'updateAdSet',
      'createAd',
      'getAds',
      'pauseAd',
      'updateAd',
      'getAvailableAdAccounts'
    ];
    
    requiredToolNames.forEach((toolName: string) => {
      expect(toolNames).toContain(toolName);
    });
  });
  
  it('should have proper descriptions for all tools', () => {
    const tools = generateAllToolDefinitions();
    
    tools.forEach((tool: Tool) => {
      // Ensure description is not empty
      expect(tool.description?.trim()).not.toBe('');
      
      // Ensure description is reasonable length
      expect(tool.description?.length).toBeGreaterThan(10);
      
      // Ensure input schema properties have descriptions
      if (tool.inputSchema?.type === 'object' && tool.inputSchema.properties) {
        Object.values(tool.inputSchema.properties).forEach((prop: any) => {
          if (typeof prop === 'object' && prop.description) {
            expect(prop.description.trim()).not.toBe('');
          }
        });
      }
    });
  });
}); 