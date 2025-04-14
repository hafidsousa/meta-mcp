/**
 * Command-line tool to list available Facebook Ad Accounts
 * Usage: npm run list-accounts
 */

import { config as loadEnv } from 'dotenv';
import { fetchAdAccounts, extractAdAccountId } from './mcp-utils';
import { FacebookAdAccount } from './types';

// Load environment variables
loadEnv();

const accessToken = process.env.FB_ACCESS_TOKEN;

if (!accessToken) {
  console.error('Error: FB_ACCESS_TOKEN is required. Please set it in your .env file.');
  process.exit(1);
}

// For debugging
console.log(`Access token length: ${accessToken.length}`);
console.log(`Access token starts with: ${accessToken.substring(0, 10)}...`);

const listAccounts = async () => {
  console.log('Fetching available ad accounts...');
  
  try {
    const result = await fetchAdAccounts(accessToken);
    
    console.log('API Response received:');
    console.log(JSON.stringify(result, null, 2));
    
    if (!result.success) {
      console.error(`Error: ${result.error}`);
      process.exit(1);
    }
    
    if (result.accounts.length === 0) {
      console.log('No ad accounts found for this access token.');
      return;
    }
    
    console.log(`\nFound ${result.accounts.length} ad account(s):\n`);
    
    // Display available accounts
    result.accounts.forEach((account: FacebookAdAccount, index: number) => {
      console.log(`${index + 1}. ID: ${extractAdAccountId(account.id)}`);
      console.log(`   Name: ${account.name}`);
      console.log(`   Status: ${account.account_status === 1 ? 'Active' : 'Inactive'}`);
      console.log(`   Amount Spent: ${account.amount_spent} ${account.currency}`);
      console.log('');
    });
    
    console.log('\nTo use a specific account, set FB_AD_ACCOUNT_ID in your .env file.');
  } catch (error) {
    console.error('Unexpected error during API call:', error);
    process.exit(1);
  }
};

listAccounts().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 