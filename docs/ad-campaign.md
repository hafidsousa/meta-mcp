# Campaign

> **IMPORTANT**: This document provides only a brief overview. For complete and authoritative documentation, ALWAYS refer to the [official Facebook Marketing API Ad Campaign Reference](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group).

## AI Usage Note

When working with Ad Campaigns, AI assistants should:
1. **ALWAYS** check the [official Facebook Marketing API documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group) for the most current endpoints and parameters
2. Understand that Campaigns define the objective of your advertising efforts
3. Always validate parameters against the current API specification as they may change over time
4. Be aware that campaign-level settings impact all ad sets and ads within the campaign

## Implemented Endpoints

Our Meta MCP implementation includes the following campaign-related endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/act_{ad_account_id}/campaigns` | POST | Create a new campaign |
| `/act_{ad_account_id}/campaigns` | GET | List all campaigns in an ad account |
| `/{campaign_id}` | GET | Get detailed information about a specific campaign |
| `/{campaign_id}` | POST | Update an existing campaign |
| `/{campaign_id}/adsets` | GET | Get all ad sets in a campaign |

## Key Campaign Fields

When working with campaigns, the following critical fields should be referenced from the [official documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group):

| Field | Description |
|-------|-------------|
| `objective` | The advertising objective (e.g., OUTCOME_TRAFFIC, OUTCOME_ENGAGEMENT) |
| `status` | Campaign status (ACTIVE, PAUSED, ARCHIVED, DELETED) |
| `special_ad_categories` | Special ad category restrictions |
| `daily_budget` | Daily spending limit |
| `lifetime_budget` | Total campaign spending limit |

## Implementation Notes

- Campaign objectives must be specified at creation and cannot be changed later
- Budget changes take effect with some delay
- Status changes propagate to child objects

For complete and up-to-date implementation details, **ALWAYS** consult the [official Facebook Marketing API Ad Campaign Reference](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group).