# Ad Account

> **IMPORTANT**: This document provides only a brief overview. For complete and authoritative documentation, ALWAYS refer to the [official Facebook Marketing API Ad Account Reference](https://developers.facebook.com/docs/marketing-api/reference/ad-account).

## AI Usage Note

When working with Ad Accounts, AI assistants should:
1. **ALWAYS** check the [official Facebook Marketing API documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-account) for the most current endpoints and parameters
2. Understand that Ad Accounts are the container for all advertising assets and activities
3. Always validate parameters against the current API specification as they may change over time
4. Be aware of account-level settings and limitations that may impact campaign creation and management

## Implemented Endpoints

Our Meta MCP implementation includes the following ad account-related endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/act_{ad_account_id}` | GET | Get details about an ad account |
| `/act_{ad_account_id}/campaigns` | GET | List campaigns in the account |
| `/act_{ad_account_id}/adsets` | GET | List ad sets in the account |
| `/act_{ad_account_id}/ads` | GET | List ads in the account |
| `/me/adaccounts` | GET | List all ad accounts accessible to the user |

## Key Ad Account Fields

When working with ad accounts, refer to the [official documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-account) for the complete list of fields available.

## Implementation Notes

- Ad account IDs are prefixed with `act_` in API calls
- Rate limits apply to ad account operations
- Permissions are required for accessing ad account data

For complete and up-to-date implementation details, **ALWAYS** consult the [official Facebook Marketing API Ad Account Reference](https://developers.facebook.com/docs/marketing-api/reference/ad-account).
