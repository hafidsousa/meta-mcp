# Meta MCP Server

A powerful MCP server for managing Facebook Marketing campaigns through the Facebook Marketing API.

## What We'll Be Building

This MCP server provides tools to manage Facebook Marketing campaigns, including:
- Creating and managing ad campaigns
- Creating and managing ad sets
- Creating and managing ads
- Retrieving campaign analytics
- Pausing/resuming advertising components

## Installation & Setup

### Prerequisites
- Node.js 18 or higher
- Facebook Marketing API credentials
- Cursor IDE (latest version)

### Environment Setup

1. Install the package globally:
```bash
npm install -g meta-mcp
```

2. Create a `.env` file with your Facebook credentials:
```env
FB_ACCESS_TOKEN=your_access_token
FB_APP_ID=your_app_id
FB_APP_SECRET=your_app_secret
FB_AD_ACCOUNT_ID=your_account_id
```

## Setting up with Cursor

### 1. Configure Global MCP Settings

Add the Facebook Marketing server to your global Cursor MCP configuration at `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "meta-mcp": {
      "command": "npx",
      "args": [
        "meta-mcp"
      ]
    }
  }
}
```

### 2. Create Project-Specific Configuration (Optional)

If you want project-specific settings, create `.cursor/mcp-servers/meta-mcp/config.json` in your project:

```json
{
  "name": "meta-mcp",
  "version": "1.0.0",
  "description": "Facebook Marketing API MCP Server",
  "transport": "stdio",
  "command": "npx",
  "args": [
    "meta-mcp"
  ],
  "tools": {
    "createCampaign": {
      "description": "Create a new Facebook ad campaign",
      "parameters": {
        "config": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Campaign name"
            },
            "objective": {
              "type": "string",
              "description": "Campaign objective",
              "enum": ["CONVERSIONS", "LINK_CLICKS", "APP_INSTALLS", "BRAND_AWARENESS", "PAGE_LIKES", "REACH", "VIDEO_VIEWS"]
            },
            "status": {
              "type": "string",
              "description": "Campaign status",
              "enum": ["ACTIVE", "PAUSED"]
            }
          },
          "required": ["name", "objective", "status"]
        }
      }
    }
  }
}
```

### 3. Create Server Rules

Create `.cursor/rules/meta-mcp.mdc`:

```markdown
---
description: Meta MCP Server Rules
globs: "**/*.ts, **/*.tsx, **/*.js, **/*.jsx"
---

# Meta MCP Server

## Available Tools

The following tools are available for managing Facebook Marketing campaigns:

### Campaign Management
- createCampaign: Create new ad campaigns
- createAdSet: Create new ad sets
- createAd: Create new ads
- pauseCampaign: Pause active campaigns
- getAdSets: Get campaign ad sets
- getAds: Get ad set ads
- pauseAdSet: Pause active ad sets
- pauseAd: Pause active ads

## Usage Examples

### Creating a Campaign
```typescript
await mcp.call('meta-mcp.createCampaign', {
  config: {
    name: "My Campaign",
    objective: "CONVERSIONS",
    status: "ACTIVE"
  }
});
```

### Creating an Ad Set
```typescript
await mcp.call('meta-mcp.createAdSet', {
  config: {
    name: "My Ad Set",
    campaignId: "123456789",
    dailyBudget: 5000,
    targeting: {
      geoLocations: {
        countries: ["US"]
      },
      ageMin: 18,
      ageMax: 35
    }
  }
});
```
```

### 4. Verify Setup

1. Restart Cursor completely
2. Open any TypeScript/JavaScript file
3. Type `/mcp` to see available MCP servers
4. You should see "meta-mcp" in the list
5. Try a test command: "create a new Facebook campaign named 'Test Campaign'"

### 5. Troubleshooting

If the server isn't showing up:

1. Check your `~/.cursor/mcp.json` file:
   - Ensure the JSON syntax is valid
   - Verify the package name and version
   - Make sure the transport is set to "stdio"

2. Check Cursor's logs:
```bash
tail -n 50 ~/.cursor/logs/cursor.log
```

3. Verify the package installation:
```bash
npx meta-mcp --version
```

4. Try reinstalling the package:
```bash
npm uninstall -g meta-mcp
npm install -g meta-mcp
```

## Available Tools

The server exposes the following MCP tools:

```typescript
// Create a new campaign
await mcp.call('meta-mcp.createCampaign', {
  config: {
    name: "My Test Campaign 2024",
    objective: "CONVERSIONS",
    status: "ACTIVE",
    specialAdCategories: ["NONE"]
  }
});

// Create an ad set
await mcp.call('meta-mcp.createAdSet', {
  config: {
    name: "US Young Adults",
    campaignId: "123456789",
    dailyBudget: 5000,
    startTime: "2024-03-20T00:00:00Z",
    targeting: {
      geoLocations: {
        countries: ["US"]
      },
      ageMin: 18,
      ageMax: 35,
      genders: [1, 2]
    },
    optimizationGoal: "CONVERSIONS",
    billingEvent: "IMPRESSIONS"
  }
});

// Create an ad
await mcp.call('meta-mcp.createAd', {
  config: {
    name: "Spring Sale Ad",
    adsetId: "123456789",
    status: "ACTIVE",
    creative: {
      name: "Spring Sale Creative",
      title: "Special Spring Offer",
      body: "Limited time deal!",
      imageUrl: "https://example.com/image.jpg",
      linkUrl: "https://example.com/offer",
      callToAction: "SHOP_NOW"
    }
  }
});

// Management operations
await mcp.call('meta-mcp.pauseCampaign', { campaignId: "123456789" });
await mcp.call('meta-mcp.getAdSets', { campaignId: "123456789" });
await mcp.call('meta-mcp.getAds', { adSetId: "123456789" });
await mcp.call('meta-mcp.pauseAdSet', { adSetId: "123456789" });
await mcp.call('meta-mcp.pauseAd', { adId: "123456789" });
```

## Testing with Claude for Desktop

### Configuration

1. Make sure you have Claude for Desktop installed and updated to the latest version.

2. Open your Claude for Desktop configuration:

MacOS:
```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

Windows:
```powershell
code $env:AppData\Claude\claude_desktop_config.json
```

3. Add the Facebook Marketing server configuration:

```json
{
    "mcpServers": {
        "facebook-marketing": {
            "command": "npx",
            "args": [
                "@hafidsousa/facebook-marketing"
            ]
        }
    }
}
```

4. Save the file and restart Claude for Desktop.

### Available Tools

The server exposes the following MCP tools:

```typescript
// Create a new campaign
await mcp.call('facebook-marketing.createCampaign', {
  config: {
    name: "My Test Campaign 2024",
    objective: "CONVERSIONS",
    status: "ACTIVE",
    specialAdCategories: ["NONE"]
  }
});

// Create an ad set
await mcp.call('facebook-marketing.createAdSet', {
  config: {
    name: "US Young Adults",
    campaignId: "123456789",
    dailyBudget: 5000,
    startTime: "2024-03-20T00:00:00Z",
    targeting: {
      geoLocations: {
        countries: ["US"]
      },
      ageMin: 18,
      ageMax: 35,
      genders: [1, 2]
    },
    optimizationGoal: "CONVERSIONS",
    billingEvent: "IMPRESSIONS"
  }
});

// Create an ad
await mcp.call('facebook-marketing.createAd', {
  config: {
    name: "Spring Sale Ad",
    adsetId: "123456789",
    status: "ACTIVE",
    creative: {
      name: "Spring Sale Creative",
      title: "Special Spring Offer",
      body: "Limited time deal!",
      imageUrl: "https://example.com/image.jpg",
      linkUrl: "https://example.com/offer",
      callToAction: "SHOP_NOW"
    }
  }
});

// Management operations
await mcp.call('facebook-marketing.pauseCampaign', { campaignId: "123456789" });
await mcp.call('facebook-marketing.getAdSets', { campaignId: "123456789" });
await mcp.call('facebook-marketing.getAds', { adSetId: "123456789" });
await mcp.call('facebook-marketing.pauseAdSet', { adSetId: "123456789" });
await mcp.call('facebook-marketing.pauseAd', { adId: "123456789" });
```

## Troubleshooting

### Claude for Desktop Integration Issues

**Getting logs from Claude for Desktop**

Check Claude's logs for MCP-related issues:
```bash
# Check Claude's logs for errors
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log
```

**Server not showing up in Claude**
1. Verify your `claude_desktop_config.json` syntax
2. Ensure the path to the server is correct
3. Restart Claude for Desktop

**Tool calls failing silently**
1. Check Claude's logs for errors
2. Verify your Facebook API credentials
3. Check Facebook Marketing API status
4. Try restarting Claude for Desktop

### Facebook API Issues

**Error: Invalid Access Token**
- Verify your FB_ACCESS_TOKEN is valid and not expired
- Check if your app has the necessary permissions

**Error: Invalid Ad Account**
- Verify your FB_AD_ACCOUNT_ID is correct
- Ensure your account has access to the Facebook Marketing API

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build: `