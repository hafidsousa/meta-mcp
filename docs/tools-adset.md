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
