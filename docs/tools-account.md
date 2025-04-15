# Ad Account Tools

These tools allow you to interact with Facebook Marketing API ad account resources.

## Table of Contents

- [getAccountAds](#getaccountads)
- [getAvailableAdAccounts](#getavailableadaccounts)

---

## getAccountAds

Gets all ads for the configured ad account.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Maximum number of ads to return |
| `status` | string (enum: ACTIVE, PAUSED, DELETED, ARCHIVED) | No | Filter ads by status |
| `adId` | string | Yes | ID of the ad |

### Example

```javascript
const accountads = await mcp.call('meta-mcp.getAccountAds', { adId: '123456789' });
console.log(accountads);
```

---

## getAvailableAdAccounts

Gets all available ad accounts for the current user or page.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | object | Yes | Facebook configuration object |
| `adId` | string | Yes | ID of the ad |

### Example

```javascript
const availableadaccounts = await mcp.call('meta-mcp.getAvailableAdAccounts', { adId: '123456789' });
console.log(availableadaccounts);
```
