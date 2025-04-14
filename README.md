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
      "args": ["meta-mcp"],
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

### 2. Find Your Ad Account ID

If you don't know your Facebook Ad Account ID, you can use the included tool to list all available ad accounts:

```bash
npx meta-mcp list-accounts
```

This tool only requires the `FB_ACCESS_TOKEN` environment variable and will display all ad accounts you have access to. You can then use one of the displayed account IDs in your configuration.

### 3. Set Required Environment Variables

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

## License

MIT License - See LICENSE file for details.