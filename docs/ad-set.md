# Ad Set

> **IMPORTANT**: This document provides only a brief overview. For complete and authoritative documentation, ALWAYS refer to the [official Facebook Marketing API Ad Set Reference](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign).

## AI Usage Note

When working with Ad Sets, AI assistants should:
1. **ALWAYS** check the [official Facebook Marketing API documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign) for the most current endpoints and parameters
2. Understand that Ad Sets are the targeting, bidding, and placement containers within a Campaign
3. Always validate parameters against the current API specification as they may change over time
4. Be aware that the reference URL uses 'ad-campaign' which refers to ad sets in the Facebook Marketing API

## Implemented Endpoints

Our Meta MCP implementation includes the following ad set-related endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/act_{ad_account_id}/adsets` | POST | Create a new ad set |
| `/act_{ad_account_id}/adsets` | GET | List all ad sets in an ad account |
| `/{campaign_id}/adsets` | GET | Get all ad sets in a campaign |
| `/{adset_id}` | GET | Get detailed information about a specific ad set |
| `/{adset_id}` | POST | Update an existing ad set |
| `/{adset_id}/ads` | GET | Get all ads in an ad set |

## Key Ad Set Fields

When working with ad sets, the following critical fields should be referenced from the [official documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign):

| Field | Description |
|-------|-------------|
| `campaign_id` | ID of the parent campaign |
| `name` | Name of the ad set |
| `targeting` | Targeting specifications (demographics, interests, behaviors) |
| `daily_budget` | Daily spending limit |
| `lifetime_budget` | Total ad set spending limit |
| `bid_amount` | Bid amount in the smallest unit of currency |
| `optimization_goal` | What the ad set is optimizing for |
| `billing_event` | When the advertiser gets charged |

## Implementation Notes

- Ad sets must belong to a campaign
- Targeting options are extensive and should be verified in the official docs
- Budget specified at the ad set level is overridden if campaign budget optimization is enabled

For complete and up-to-date implementation details, **ALWAYS** consult the [official Facebook Marketing API Ad Set Reference](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign).