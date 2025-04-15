/**
 * Command-line tool to create a Facebook Ad Set with customization options
 * 
 * Usage:
 * npx ts-node src/scripts/create-adset.ts [options]
 * 
 * Options:
 *   --campaign-id       Required: Facebook Campaign ID to create the ad set under
 *   --name              Optional: Custom name for the ad set (default: generated based on targeting)
 *   --daily-budget      Optional: Daily budget in dollars (default: 50.00)
 *   --lifetime-budget   Optional: Lifetime budget in dollars (alternative to daily budget)
 *   --start-time        Optional: Start time for the ad set (for lifetime budget, format: YYYY-MM-DDTHH:MM:SS-HHMM)
 *   --end-time          Optional: End time for the ad set (for lifetime budget, format: YYYY-MM-DDTHH:MM:SS-HHMM)
 *   --countries         Optional: Comma-separated list of country codes (default: US)
 *   --age-min           Optional: Minimum age for targeting (default: 18)
 *   --age-max           Optional: Maximum age for targeting (default: 65)
 *   --gender            Optional: Gender targeting (all, male, female) (default: all)
 *   --optimization      Optional: Optimization goal (default: LINK_CLICKS)
 *   --billing           Optional: Billing event (default: IMPRESSIONS)
 *   --bid-amount        Optional: Bid amount in cents (default: based on optimization goal)
 *   --status            Optional: Initial status (ACTIVE, PAUSED) (default: PAUSED)
 *   --placements        Optional: Comma-separated list of placements (default: feed)
 * 
 * Example:
 *   npx ts-node src/scripts/create-adset.ts --campaign-id=23456789 --name="Summer-Promo" --daily-budget=100 --countries=US,CA --age-min=25 --age-max=45 --gender=female --optimization=LINK_CLICKS --billing=IMPRESSIONS
 */

import chalk from 'chalk';
import { Command } from 'commander';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { config as dotenvConfig } from 'dotenv';
import { existsSync } from 'fs';
import { homedir } from 'os';
import path from 'path';
import { FacebookMarketingClient } from '../client';
import { AdSetConfig, FacebookConfig } from '../types';

dayjs.extend(utc);

const defaultEnvFile = path.join(homedir(), '.facebook.env');
const localEnvFile = path.join(process.cwd(), '.env');

if (existsSync(localEnvFile)) {
  dotenvConfig({ path: localEnvFile });
} else if (existsSync(defaultEnvFile)) {
  dotenvConfig({ path: defaultEnvFile });
} else {
  dotenvConfig();
}

// Initialize Facebook client with environment variables
const fbConfig: FacebookConfig = {
  adAccountId: process.env.FB_AD_ACCOUNT_ID || '',
  accessToken: process.env.FB_ACCESS_TOKEN || '',
  appId: process.env.FB_APP_ID,
  appSecret: process.env.FB_APP_SECRET
};

const client = new FacebookMarketingClient(fbConfig);

// Type definitions for command line arguments
interface AdSetArgs {
  name: string;
  campaignId: string;
  dailyBudget?: string;
  lifetimeBudget?: string;
  startTime?: string;
  endTime?: string;
  status?: 'ACTIVE' | 'PAUSED';
  ageMin?: string;
  ageMax?: string;
  countries?: string;
  genders?: string;
  interests?: string;
  optimizationGoal?: string;
  billingEvent?: string;
  placements?: string;
  bidAmount?: string;
}

// Define the accepted optimization goals
const OPTIMIZATION_GOALS = [
  'NONE', 'APP_INSTALLS', 'AD_RECALL_LIFT', 'ENGAGED_USERS', 'EVENT_RESPONSES', 
  'IMPRESSIONS', 'LEAD_GENERATION', 'QUALITY_LEAD', 'LINK_CLICKS', 'OFFSITE_CONVERSIONS', 
  'PAGE_LIKES', 'POST_ENGAGEMENT', 'QUALITY_CALL', 'REACH', 'LANDING_PAGE_VIEWS', 
  'VISIT_INSTAGRAM_PROFILE', 'VALUE', 'THRUPLAY', 'DERIVED_EVENTS', 'CONVERSIONS'
];

// Define the accepted billing events
const BILLING_EVENTS = [
  'APP_INSTALLS', 'IMPRESSIONS', 'LINK_CLICKS', 'NONE', 'PAGE_LIKES', 
  'POST_ENGAGEMENT', 'THRUPLAY'
];

// Define available placements
const PLACEMENTS = [
  'facebook', 'instagram', 'audience_network', 'messenger'
];

// Parse and validate command line arguments
const program = new Command();
program
  .name('create-adset')
  .description('Create a new Facebook Ad Set')
  .requiredOption('--name <n>', 'Name of the ad set')
  .requiredOption('--campaign-id <id>', 'Campaign ID for the ad set')
  .option('--daily-budget <amount>', 'Daily budget in USD (e.g., 20.00)')
  .option('--lifetime-budget <amount>', 'Lifetime budget in USD (e.g., 500.00)')
  .option('--start-time <datetime>', 'Start time in ISO format (default: now)')
  .option('--end-time <datetime>', 'End time in ISO format')
  .option('--status <status>', 'Initial status (ACTIVE or PAUSED)', 'ACTIVE')
  .option('--age-min <age>', 'Minimum age for targeting', '18')
  .option('--age-max <age>', 'Maximum age for targeting', '65')
  .option('--countries <list>', 'Comma-separated list of country codes', 'US')
  .option('--genders <list>', 'Comma-separated list of genders (1=male, 2=female)', '1,2')
  .option('--interests <list>', 'Comma-separated list of interest IDs')
  .option('--optimization-goal <goal>', `One of: ${OPTIMIZATION_GOALS.join(', ')}`, 'LINK_CLICKS')
  .option('--billing-event <event>', `One of: ${BILLING_EVENTS.join(', ')}`, 'IMPRESSIONS')
  .option('--placements <list>', `Comma-separated list of placements: ${PLACEMENTS.join(', ')}`, 'facebook,instagram')
  .option('--bid-amount <amount>', 'Bid amount in USD (required for some optimization goals)')
  .parse(process.argv);

const options = program.opts<AdSetArgs>();

// Validate budget options - either daily or lifetime must be provided
if (!options.dailyBudget && !options.lifetimeBudget) {
  console.error(chalk.red('Error: Either --daily-budget or --lifetime-budget must be provided'));
  process.exit(1);
}

// Validate that daily and lifetime budgets are not both provided
if (options.dailyBudget && options.lifetimeBudget) {
  console.error(chalk.red('Error: Cannot provide both --daily-budget and --lifetime-budget'));
  process.exit(1);
}

// Validate optimization goal
if (options.optimizationGoal && !OPTIMIZATION_GOALS.includes(options.optimizationGoal)) {
  console.error(chalk.red(`Error: Invalid optimization goal. Must be one of: ${OPTIMIZATION_GOALS.join(', ')}`));
  process.exit(1);
}

// Validate billing event
if (options.billingEvent && !BILLING_EVENTS.includes(options.billingEvent)) {
  console.error(chalk.red(`Error: Invalid billing event. Must be one of: ${BILLING_EVENTS.join(', ')}`));
  process.exit(1);
}

// Validate placements
const selectedPlacements = options.placements ? options.placements.split(',') : ['facebook'];
for (const placement of selectedPlacements) {
  if (!PLACEMENTS.includes(placement)) {
    console.error(chalk.red(`Error: Invalid placement '${placement}'. Must be one of: ${PLACEMENTS.join(', ')}`));
    process.exit(1);
  }
}

// Build the adset config
const adsetConfig: AdSetConfig = {
  name: options.name,
  campaignId: options.campaignId,
  status: options.status || 'PAUSED',
  optimizationGoal: (options.optimizationGoal || 'LINK_CLICKS') as AdSetConfig['optimizationGoal'],
  billingEvent: (options.billingEvent || 'IMPRESSIONS') as AdSetConfig['billingEvent'],
  targeting: {
    ageMin: parseInt(options.ageMin || '18'),
    ageMax: parseInt(options.ageMax || '65'),
    geoLocations: {
      countries: options.countries ? options.countries.split(',') : ['US']
    },
    genders: options.genders ? options.genders.split(',').map(g => parseInt(g)) : [1, 2],
    publisherPlatforms: selectedPlacements
  }
};

// Add daily budget or lifetime budget
if (options.dailyBudget) {
  adsetConfig.dailyBudget = Math.round(parseFloat(options.dailyBudget) * 100);
} else if (options.lifetimeBudget) {
  adsetConfig.lifetimeBudget = Math.round(parseFloat(options.lifetimeBudget) * 100);
}

// Add start time and end time if provided
if (options.startTime) {
  adsetConfig.startTime = options.startTime;
} else {
  adsetConfig.startTime = dayjs().add(1, 'hour').utc().format();
}

if (options.endTime) {
  adsetConfig.endTime = options.endTime;
}

// Add interests if provided
if (options.interests) {
  adsetConfig.targeting.interests = options.interests.split(',').map(id => ({ id }));
}

// Add bid amount if provided
if (options.bidAmount) {
  adsetConfig.bidAmount = Math.round(parseFloat(options.bidAmount) * 100);
}

// Execute the creation
async function run() {
  try {
    console.log(chalk.blue('Creating Facebook Ad Set with the following configuration:'));
    console.log(JSON.stringify(adsetConfig, null, 2));
    
    const adSetResponse = await client.createAdSet(adsetConfig);
    
    if (!adSetResponse || !adSetResponse.success) {
      throw new Error('Failed to create ad set');
    }
    
    const adSet = adSetResponse.data;
    
    console.log(chalk.green('\nAd Set created successfully:'));
    console.log(chalk.green(`ID: ${adSetResponse.id}`));
    console.log(chalk.green(`Name: ${adSet?.name}`));
    console.log(chalk.green(`Status: ${adSet?.status}`));
    
    console.log(chalk.blue('\nFull response:'));
    console.log(JSON.stringify(adSetResponse, null, 2));
  } catch (error) {
    console.error(chalk.red('Error creating ad set:'));
    console.error(error);
    process.exit(1);
  }
}

run(); 