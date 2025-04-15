# Ad Set Tools

These tools allow you to interact with Facebook Marketing API ad set resources.

## Table of Contents

- [createAdSet](#createadset)
- [getAdSets](#getadsets)
- [getAdSet](#getadset)
- [getAccountAdSets](#getaccountadsets)
- [pauseAdSet](#pauseadset)
- [updateAdSet](#updateadset)

---

## createAdSet

Creates a new ad set within a campaign. Ad sets define targeting, budget, scheduling, and bidding for your ads.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | object | Yes | AdSet configuration object |

### Example

```javascript
const result = await mcp.call('meta-mcp.createAdSet', { config: { ... } });
console.log(`Created with ID: ${result.id}`);
```

### ⚠️ Important Targeting Requirements

When using the following targeting parameters, you **MUST** use verified and valid Facebook IDs. Using invalid IDs will result in API errors:

- **interests**: All interest IDs must be valid Facebook interest taxonomy IDs
- **behaviors**: All behavior IDs must be valid Facebook behavior taxonomy IDs
- **regions**: Must use valid Facebook region keys
- **cities**: Must use valid Facebook city keys
- **zip/postal codes**: Must be in a recognized format for the country
- **customAudiences**: Must be valid custom audience IDs from your Facebook account
- **exclusions**: All IDs within exclusion rules must be valid Facebook taxonomy IDs

To obtain valid IDs:
1. Use the Facebook Ads Manager UI to find and verify IDs
2. Use the [Facebook Marketing API targeting search endpoints](https://developers.facebook.com/docs/marketing-api/audiences/reference/targeting-search/)
3. Test targeting parameters in smaller configurations before building complex targeting rules

Invalid IDs will typically result in error code #100 from the Facebook API with a message like "Param targeting[interests][0][id] must be a valid interest id".

---

## getAdSets

Gets all ad sets for a specific campaign.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaignId` | string | No | ID of the campaign |
| `adSetId` | string | Yes | ID of the ad set |

### Example

```javascript
const adsets = await mcp.call('meta-mcp.getAdSets', { campaignId: '123456789' });
console.log(adsets);
```

---

## getAdSet

Gets details for a specific ad set by ID.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `adSetId` | string | Yes | ID of the ad set |

### Example

```javascript
const adset = await mcp.call('meta-mcp.getAdSet', { adSetId: '123456789' });
console.log(adset);
```

---

## getAccountAdSets

Gets all ad sets for the configured ad account.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Maximum number of ad sets to return |
| `status` | string (enum: ACTIVE, PAUSED, DELETED, ARCHIVED) | No | Filter ad sets by status |
| `adSetId` | string | Yes | ID of the ad set |

### Example

```javascript
const accountadsets = await mcp.call('meta-mcp.getAccountAdSets', { adSetId: '123456789' });
console.log(accountadsets);
```

---

## pauseAdSet

Pauses an active ad set and all its ads.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `adSetId` | string | Yes | ID of the ad set |

### Example

```javascript
const success = await mcp.call('meta-mcp.pauseAdSet', { adSetId: '123456789' });
console.log(`Operation pause successful`);
```

---

## updateAdSet

Updates an existing ad set with new configuration values.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | object | Yes | AdSet configuration object |
| `adSetId` | string | Yes | ID of the ad set |

### Example

```javascript
const success = await mcp.call('meta-mcp.updateAdSet', { adSetId: '123456789', config: { ... } });
console.log(`Operation update successful`);
```
