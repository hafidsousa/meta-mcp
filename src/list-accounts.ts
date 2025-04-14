/**
 * Command-line tool to list available Facebook Ad Accounts
 * Usage: npm run list-accounts
 */

import { config as loadEnv } from 'dotenv';
import { fetchAdAccounts, extractAdAccountId } from './mcp-utils';

// Load environment variables
loadEnv();

const accessToken = process.env.FB_ACCESS_TOKEN;

if (!accessToken) {
  console.error('Error: FB_ACCESS_TOKEN is required. Please set it in your .env file.');
  process.exit(1);
}

const listAccounts = async () => {
  console.log('Fetching available ad accounts...');
  
  const result = await fetchAdAccounts(accessToken);
  
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
  result.accounts.forEach((account, index) => {
    console.log(`${index + 1}. ID: act_${extractAdAccountId(account.id)}`);
    console.log(`   Name: ${account.name}`);
    console.log(`   Status: ${account.account_status === 1 ? 'Active' : 'Inactive'}`);
    console.log(`   Amount Spent: ${account.amount_spent} ${account.currency}`);
    console.log('');
  });
  
  console.log('\nTo use a specific account, set FB_AD_ACCOUNT_ID in your .env file.');
};

listAccounts().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
}); 