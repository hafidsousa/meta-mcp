# Ad

> **IMPORTANT**: This document provides only a brief overview. For complete and authoritative documentation, ALWAYS refer to the [official Facebook Marketing API Ad Reference](https://developers.facebook.com/docs/marketing-api/reference/adgroup).

## AI Usage Note

When working with Ads, AI assistants should:
1. **ALWAYS** check the [official Facebook Marketing API documentation](https://developers.facebook.com/docs/marketing-api/reference/adgroup) for the most current endpoints and parameters
2. Understand that Ads contain the creative content, including images, videos, text, and links
3. Always validate parameters against the current API specification as they may change over time
4. Be aware that ad creatives must comply with Facebook's advertising policies
5. Note that the reference URL uses 'adgroup' which refers to ads in the Facebook Marketing API

## Implemented Endpoints

Our Meta MCP implementation includes the following ad-related endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/act_{ad_account_id}/ads` | POST | Create new ads |
| `/act_{ad_account_id}/ads` | GET | List all ads for an ad account |
| `/{adset_id}/ads` | GET | Get all ads in an ad set |
| `/{ad_id}` | GET | Get detailed information about a specific ad |
| `/{ad_id}` | POST | Update an existing ad |

## Key Ad Fields

When working with ads, the following critical fields should be referenced from the [official documentation](https://developers.facebook.com/docs/marketing-api/reference/adgroup):

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The unique identifier for the ad |
| `name` | string | The name of the ad |
| `adset_id` | string | The ID of the ad set this ad belongs to |
| `campaign_id` | string | The ID of the campaign this ad belongs to |
| `status` | enum | Current status: ACTIVE, PAUSED, DELETED, ARCHIVED |
| `effective_status` | string | The effective status considering parent campaign and ad set |
| `configured_status` | string | The configured status of this specific ad |
| `creative` | object | The ad creative details or creative_id |
| `tracking_specs` | array | Tracking specifications for the ad |
| `adlabels` | array | Labels associated with this ad |
| `bid_amount` | string | The bid amount in the ad's currency |
| `conversion_domain` | string | The domain where conversions happen |

## Implementation Notes

- When updating an ad, only include the fields you want to change
- To update the creative, you can either provide a creative_id or a complete creative object
- Status changes are propagated through the campaign hierarchy
- Always check for rate limits when making multiple API calls

For complete and up-to-date implementation details, **ALWAYS** consult the [official Facebook Marketing API Ad Reference](https://developers.facebook.com/docs/marketing-api/reference/adgroup). 