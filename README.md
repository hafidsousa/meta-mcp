# Facebook Marketing API Client for Meta Client Platform (MCP)

This package provides tools for interacting with the Facebook Marketing API through the Meta Client Platform.

## Important Update

**As of version 2.0.0**: All request payloads must use `snake_case` format as they are passed directly to the Facebook Marketing API without transformation. Previous versions used camelCase with automatic conversion.

The server now acts as a direct proxy to the Facebook Marketing API, passing all parameters through without modification and returning Facebook API responses directly.

## Installation

```bash
npm install meta-mcp
```

## Configuration

Set the following environment variables:

```
FB_ACCESS_TOKEN=your_facebook_access_token
FB_AD_ACCOUNT_ID=your_ad_account_id
FB_API_VERSION=v22.0
FB_API_DOMAIN=https://graph.facebook.com
```

## Usage Examples

### Creating a Campaign

```javascript
const result = await callTool({
  name: "createCampaign",
  arguments: {
    config: {
      name: "Test Campaign",
      objective: "OUTCOME_AWARENESS",
      status: "PAUSED",
      special_ad_categories: ["NONE"],
      daily_budget: 2000, // $20.00
      bid_strategy: "LOWEST_COST_WITHOUT_CAP"
    }
  }
});
```

### Updating a Campaign

```javascript
const result = await callTool({
  name: "updateCampaign",
  arguments: {
    campaignId: "23848238482384",
    config: {
      name: "Updated Campaign Name",
      daily_budget: 5000 // $50.00
    }
  }
});
```

### Creating an Ad Set

```javascript
const result = await callTool({
  name: "createAdSet",
  arguments: {
    config: {
      name: "My First Ad Set",
      campaign_id: "23848238482384",
      daily_budget: 1000, // $10.00
      billing_event: "IMPRESSIONS",
      optimization_goal: "REACH",
      bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      targeting: {
        geo_locations: {
          countries: ["US"]
        },
        age_min: 18,
        age_max: 65,
        genders: [1, 2]
      },
      status: "PAUSED"
    }
  }
});
```

### Creating an Ad

```javascript
const result = await callTool({
  name: "createAd",
  arguments: {
    config: {
      name: "My First Ad",
      adset_id: "23848238482384",
      status: "PAUSED",
      creative: {
        name: "My First Creative",
        title: "Try our amazing product!",
        body: "This is the best product you'll ever use.",
        link_url: "https://example.com",
        image_url: "https://example.com/image.jpg",
        call_to_action: "LEARN_MORE"
      }
    }
  }
});
```

### Getting Campaigns

```javascript
const result = await callTool({
  name: "getCampaigns",
  arguments: {
    limit: 10,
    status: "ACTIVE",
    datePreset: "last_30_days"
  }
});
```

### Getting Ad Sets

```javascript
const result = await callTool({
  name: "getAdSets",
  arguments: {
    campaignId: "23848238482384"
  }
});
```

### Getting Ads

```javascript
const result = await callTool({
  name: "getAds",
  arguments: {
    adSetId: "23848238482384"
  }
});
```

### Pausing a Campaign

```javascript
const result = await callTool({
  name: "pauseCampaign",
  arguments: {
    campaignId: "23848238482384"
  }
});
```

## Available Tools

### Campaign Management
- `createCampaign`: Create a new campaign
- `updateCampaign`: Update an existing campaign
- `getCampaign`: Get details for a specific campaign
- `getCampaigns`: Get a list of campaigns
- `pauseCampaign`: Pause an active campaign

### Ad Set Management
- `createAdSet`: Create a new ad set
- `updateAdSet`: Update an existing ad set
- `getAdSet`: Get details for a specific ad set
- `getAdSets`: Get a list of ad sets for a campaign
- `getAccountAdSets`: Get a list of ad sets for the account
- `pauseAdSet`: Pause an active ad set

### Ad Management
- `createAd`: Create a new ad
- `updateAd`: Update an existing ad
- `getAd`: Get details for a specific ad
- `getAds`: Get a list of ads for an ad set
- `getAccountAds`: Get a list of ads for the account
- `pauseAd`: Pause an active ad

### Account Management
- `getAvailableAdAccounts`: Get a list of available ad accounts

## Facebook API Parameters

Refer to the [Facebook Marketing API documentation](https://developers.facebook.com/docs/marketing-apis/) for details on available parameters and their formats. As the server now acts as a direct proxy, you can use any parameter documented in the Facebook Marketing API directly in your requests.

## Error Handling

Errors from the Facebook API are passed directly to the client without modification. Check the error message and details for information about what went wrong.

## License

MIT