/**
 * Test script for the MCP server
 * This simulates communication with the server to verify it's working
 */

import { spawn } from 'child_process';
import { randomUUID } from 'crypto';

// Start the MCP server as a child process
const server = spawn('node', ['dist/server.js'], {
  stdio: ['pipe', 'pipe', process.stderr],
  env: {
    ...process.env,
    FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN || 'test-token',
    FB_AD_ACCOUNT_ID: process.env.FB_AD_ACCOUNT_ID || 'test-account'
  }
});

// Track request IDs and their callbacks
const requests: Map<string, (result: any) => void> = new Map();

// Handle server output
let buffer = '';
server.stdout.on('data', (data) => {
  buffer += data.toString();
  
  // Process complete JSON messages
  let newlineIndex;
  while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
    const message = buffer.slice(0, newlineIndex);
    buffer = buffer.slice(newlineIndex + 1);
    
    try {
      const response = JSON.parse(message);
      console.log('Received response:', response);
      
      // Handle 'ready' notification
      if (response.method === 'ready') {
        console.log('MCP server is ready!');
        testServer();
        return;
      }
      
      // Handle response to a request
      const callback = requests.get(response.id);
      if (callback) {
        callback(response.result);
        requests.delete(response.id);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
    }
  }
});

// Send a request to the server
function sendRequest(method: string, params?: any): Promise<any> {
  return new Promise((resolve) => {
    const id = randomUUID();
    requests.set(id, resolve);
    
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };
    
    console.log(`Sending request: ${method}`);
    server.stdin.write(JSON.stringify(request) + '\n');
  });
}

// Test the server with a simple request
async function testServer() {
  try {
    console.log('Testing getCampaigns method...');
    const campaigns = await sendRequest('getCampaigns');
    console.log('Response received:', campaigns);
    
    // Exit after test
    console.log('Test completed successfully!');
    server.kill();
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    server.kill();
    process.exit(1);
  }
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.kill();
  process.exit(0);
}); 