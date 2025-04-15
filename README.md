# Meta MCP

Facebook Marketing API integration for Cursor via MCP.

## Installation

You can use this package without installation via `npx`:

```bash
npx meta-mcp
```

For global installation (optional):

```bash
npm install -g meta-mcp
```

## Setup in Cursor

### 1. Configure MCP Settings

Add Meta MCP to your Cursor MCP configuration at `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "meta-mcp": {
      "command": "npx",
      "args": ["-y", "meta-mcp"],
      "env": {
        "FB_ACCESS_TOKEN": "your_access_token_here",
        "FB_AD_ACCOUNT_ID": "your_ad_account_id_here",
        "FB_APP_ID": "your_app_id_here (optional with MCP tools)",
        "FB_APP_SECRET": "your_app_secret_here (optional with MCP tools)"
      }
    }
  }
}
```

The `-y` flag ensures that npx runs in non-interactive mode, automatically approving any prompts that might appear during installation or execution.

### 2. Find Your Ad Account ID

If you don't know your Facebook Ad Account ID, you can use the included tool to list all available ad accounts:

```bash
npx meta-mcp list-accounts
```

This tool only requires the `FB_ACCESS_TOKEN` environment variable and will display all ad accounts you have access to. You can then use one of the displayed account IDs in your configuration.

### 3. Get a Facebook Access Token

To obtain a Facebook access token with the necessary permissions:

```bash
npx meta-mcp generate-token-url
```

This will generate a URL you can visit to authorize your app and get an access token. The tool provides step-by-step instructions for obtaining and using the token.

Alternatively, you can visit the [Graph API Explorer](https://developers.facebook.com/tools/explorer/) to generate a token manually.

### 4. Set Required Environment Variables

You can set environment variables either through the MCP configuration as shown above, or by creating a `.env` file in your project:

```env
# Facebook API Credentials
FB_ACCESS_TOKEN=your_access_token_here
FB_AD_ACCOUNT_ID=your_ad_account_id_here
# Optional with MCP tools
FB_APP_ID=your_app_id_here
FB_APP_SECRET=your_app_secret_here
```

## Using in Cursor

### Vibe Coding Examples

With Cursor's AI, you can use natural language to work with Meta MCP. Simply describe what you want to do, and the AI will generate the appropriate code:

#### Create a Campaign

Instead of writing code manually, just tell Cursor what you want:

```
Create a new Facebook campaign named "Spring Sale 2024" with CONVERSIONS objective and ACTIVE status
```

The AI will generate the appropriate code:

```javascript
const result = await mcp.call('meta-mcp.createCampaign', {
  config: {
    name: "Spring Sale 2024",
    objective: "CONVERSIONS",
    status: "ACTIVE",
    specialAdCategories: ["NONE"]
  }
});

console.log(`Created campaign with ID: ${result.id}`);
```

#### Create an Ad Set

```
Create a Facebook ad set targeting US adults between 18-65 with a $50 daily budget
```

The AI will generate:

```javascript
const adSetResult = await mcp.call('meta-mcp.createAdSet', {
  config: {
    name: "US Mobile Users",
    campaignId: "123456789", // Use the actual campaign ID
    dailyBudget: 5000, // $50.00
    targeting: {
      geoLocations: {
        countries: ["US"]
      },
      ageMin: 18,
      ageMax: 65
    },
    optimizationGoal: "CONVERSIONS",
    billingEvent: "IMPRESSIONS"
  }
});
```

#### Create an Ad

```
Create a Facebook ad with "Limited Time Offer" as the title and "Get 20% off our entire catalog!" as the body
```

The AI will generate:

```javascript
const adResult = await mcp.call('meta-mcp.createAd', {
  config: {
    name: "Main Product Ad",
    adsetId: "123456789", // Use the actual ad set ID
    status: "ACTIVE",
    creative: {
      name: "Spring Sale Creative",
      title: "Limited Time Offer",
      body: "Get 20% off our entire catalog!",
      imageUrl: "https://example.com/sale-image.jpg",
      linkUrl: "https://example.com/spring-sale",
      callToAction: "SHOP_NOW"
    }
  }
});
```

#### Find Available Ad Accounts

```
Get a list of all my Facebook ad accounts
```

The AI will generate:

```javascript
const accounts = await mcp.call('meta-mcp.getAvailableAdAccounts', {});

// Display available accounts
accounts.forEach(account => {
  console.log(`Account ID: ${account.id}`);
  console.log(`Name: ${account.name}`);
  console.log(`Status: ${account.account_status === 1 ? 'Active' : 'Inactive'}`);
  console.log('---');
});
```

### Campaign Management

You can also manage your campaigns with natural language:

```
Pause the Facebook campaign with ID 123456789
```

```
Get all ad sets for the Facebook campaign 123456789
```

```
Get all ads in the Facebook ad set 123456789
```

```
Pause the Facebook ad set with ID 123456789
```

```
Pause the Facebook ad with ID 123456789
```

## Facebook Marketing API Implementation Status

### Current Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| **Authentication** | ✅ Complete | Using access tokens with proper validation |
| **Campaign Management** | ✅ Complete | Full CRUD with proper field validation |
| **Ad Set Management** | ⚠️ Partial | Basic functionality implemented |
| **Ad Creation** | ⚠️ Partial | Simple ad creation working |
| **Creatives** | ⚠️ Partial | Basic image ads supported |
| **Targeting** | ⚠️ Partial | Basic demographic targeting implemented |
| **Custom Audiences** | ❌ Not Started | Planned for Phase 2 |
| **Insights & Analytics** | ❌ Not Started | Planned for Phase 3 |
| **Lead Generation** | ❌ Not Started | Planned for Phase 5 |
| **Compliance Features** | ❌ Not Started | Planned for Phase 5 |
| **Dashboard Integration** | ❌ Not Started | Planned for Phase 6 |

### Available Facebook Marketing API Endpoints

#### Campaign Management
```
POST /act_{ad_account_id}/campaigns - Create new campaigns
GET /act_{ad_account_id}/campaigns - List all campaigns
GET /{campaign_id} - Get campaign details
POST /{campaign_id} - Update campaign
DELETE /{campaign_id} - Delete campaign
```

#### Ad Set Management
```
POST /act_{ad_account_id}/adsets - Create new ad sets
GET /act_{ad_account_id}/adsets - List all ad sets
GET /{campaign_id}/adsets - Get ad sets in campaign
GET /{adset_id} - Get ad set details
POST /{adset_id} - Update ad set
DELETE /{adset_id} - Delete ad set
```

#### Ad Management
```
POST /act_{ad_account_id}/ads - Create new ads ✅
GET /act_{ad_account_id}/ads - List all ads ✅
GET /{adset_id}/ads - Get ads in ad set ✅
GET /{ad_id} - Get ad details ✅
POST /{ad_id} - Update ad ✅
DELETE /{ad_id} - Delete ad
```

#### Creative Management
```
POST /act_{ad_account_id}/adcreatives - Create ad creatives
GET /act_{ad_account_id}/adcreatives - List ad creatives
GET /{creative_id} - Get creative details
POST /{creative_id} - Update creative
```

#### Targeting
```
GET /act_{ad_account_id}/targetingbrowse - Browse targeting options
GET /act_{ad_account_id}/targetingsearch - Search targeting options
GET /act_{ad_account_id}/targetingvalidation - Validate targeting specifications
```

#### Insights & Analytics
```
GET /{campaign_id}/insights - Get campaign performance data
GET /{adset_id}/insights - Get ad set performance data
GET /{ad_id}/insights - Get ad performance data
GET /act_{ad_account_id}/insights - Get account-level insights
```

#### Audience Management
```
GET /act_{ad_account_id}/customaudiences - List custom audiences
POST /act_{ad_account_id}/customaudiences - Create custom audience
GET /act_{ad_account_id}/lookalikaudiences - List lookalike audiences
POST /act_{ad_account_id}/lookalikaudiences - Create lookalike audience
```

#### Special Features
```
GET /act_{ad_account_id}/delivery_estimate - Estimate ad delivery performance
GET /act_{ad_account_id}/adspixels - Manage conversion tracking pixels
POST /act_{ad_account_id}/leadgen_forms - Create lead generation forms
```

## Available Tools

| Tool | Description |
|------|-------------|
| `createCampaign` | Create a new ad campaign |
| `createAdSet` | Create a new ad set within a campaign |
| `createAd` | Create a new ad within an ad set |
| `getAdSets` | Get all ad sets for a campaign |
| `getAds` | Get all ads for an ad set |
| `pauseCampaign` | Pause an active campaign |
| `pauseAdSet` | Pause an active ad set |
| `pauseAd` | Pause an active ad |
| `getAvailableAdAccounts` | Get all ad accounts available to the user |

## Troubleshooting

If you encounter issues:

1. Check that your Facebook API credentials are correct
2. Ensure you have the necessary permissions for the Facebook Ad Account
3. Verify the MCP server is properly configured in Cursor
4. Check Cursor logs: `~/.cursor/logs/cursor.log`

## For Developers

If you're interested in contributing to this project or running it locally for development, please see the [Developer Guide](./DEVELOPER.md) for detailed instructions.

## License

MIT License - See LICENSE file for details.

## Ad Campaign Creation

This package includes a script for creating a complete Facebook ad campaign including:
1. Campaign with objectives (conversions, brand awareness, etc.)
2. Ad Set with targeting options and budget
3. Ad with creative content (images, text, etc.)

### Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the `.env.example` file to `.env` and fill in your Facebook API credentials:
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file with your credentials:
   - `FB_AD_ACCOUNT_ID`: Your Facebook Ad Account ID (without the 'act_' prefix)
   - `FB_ACCESS_TOKEN`: Your Facebook Marketing API access token
   - Optional: `FB_APP_ID` and `FB_APP_SECRET` for some advanced features

### Running the Campaign Creation Script

Execute the script to create a new campaign:

```bash
npx ts-node src/create-campaign.ts
```

The script will:
- Create a new campaign with CONVERSIONS objective (paused by default)
- Create an ad set with targeting parameters (US, ages 25-45, technology interests)
- Create an ad with sample creative content

All components are created in PAUSED state for safety. Review them in Facebook Ads Manager before activating.

### Customizing the Campaign

To customize the campaign, edit the `src/create-campaign.ts` file and modify:

- Campaign configuration: Objective, name, special ad categories
- Ad Set configuration: Budget, targeting options, optimization goals
- Ad Creative: Title, body text, image URL, call to action, etc.

### Listing Existing Campaigns

To view your existing campaigns:

```bash
npm run list-campaigns
```

### Managing API Access Tokens

To generate a token URL:

```bash
npm run generate-token-url
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| FB_ACCESS_TOKEN | Facebook Marketing API access token | Yes |
| FB_AD_ACCOUNT_ID | Facebook Ad Account ID | Yes |
| FB_APP_ID | Facebook App ID | No |
| FB_APP_SECRET | Facebook App Secret | No |

## Command-line Scripts

Meta MCP includes several command-line scripts to help you work with the Facebook Marketing API:

### Utility Scripts

- `npm run list-accounts` - List all available ad accounts
- `npm run list-campaigns` - List all campaigns for the configured ad account
- `npm run generate-token-url` - Generate a URL to obtain a Facebook access token
- `npm run create-campaign` - Create a simple test campaign

### Ad Set Creation Script

Create an ad set with specific targeting parameters:

```bash
npm run create-adset -- --campaign-id=123456789 --name="Summer Sale" --daily-budget=75 --countries=US,CA --age-min=25 --age-max=55 --gender=female
```

Available parameters:
- `--campaign-id` (required): Facebook Campaign ID
- `--name`: Custom name for the ad set
- `--daily-budget`: Daily budget in dollars (default: 50.00)
- `--countries`: Comma-separated list of country codes (default: US)
- `--age-min`: Minimum age for targeting (default: 18)
- `--age-max`: Maximum age for targeting (default: 65)
- `--gender`: Gender targeting (all, male, female) (default: all)
- `--optimization`: Optimization goal (default: CONVERSIONS)
- `--billing`: Billing event (default: IMPRESSIONS)
- `--status`: Initial status (ACTIVE, PAUSED) (default: PAUSED)

To see all available options:
```bash
npm run create-adset -- --help
```

## Documentation

### Reference Documentation

This package includes comprehensive documentation in the `docs/` directory:

- **Tool Reference**: Generated documentation for all available tools in both JSON and Markdown formats
- **Entity Reference**: Detailed information about campaigns, ad sets, ads, and ad accounts

### Generating Documentation

You can generate or update the documentation using the included tools:

```bash
# Generate JSON documentation
npm run generate-docs

# Generate JSON documentation to file
npm run generate-docs -- --file

# Generate Markdown documentation (after generating JSON)
npm run generate-markdown-docs

# Generate both JSON and Markdown documentation
npm run docs
```

The generated documentation will be available in the `docs/` directory.