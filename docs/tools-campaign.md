# Campaign Tools

These tools allow you to interact with Facebook Marketing API campaign resources.

## Table of Contents

- [createCampaign](#createcampaign)
- [getCampaigns](#getcampaigns)
- [getCampaign](#getcampaign)
- [pauseCampaign](#pausecampaign)
- [updateCampaign](#updatecampaign)

---

## createCampaign

Creates a new Facebook ad campaign. This is the first step in the ad creation process. A campaign defines the overall objective and budget strategy.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | object | Yes | Campaign configuration object |

### Example

```javascript
const result = await mcp.call('meta-mcp.createCampaign', { config: { ... } });
console.log(`Created with ID: ${result.id}`);
```

---

## getCampaigns

Gets all campaigns for the ad account. Returns an array of campaign objects with their IDs, names, status, and other details.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Maximum number of campaigns to return (default: 25, max: 100) |
| `status` | string (enum: ACTIVE, PAUSED, DELETED, ARCHIVED) | No | Filter campaigns by status |
| `campaignId` | string | Yes | ID of the campaign |

### Example

```javascript
const campaigns = await mcp.call('meta-mcp.getCampaigns', { campaignId: '123456789' });
console.log(campaigns);
```

---

## getCampaign

Gets details for a specific campaign by ID.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaignId` | string | Yes | ID of the campaign |

### Example

```javascript
const campaign = await mcp.call('meta-mcp.getCampaign', { campaignId: '123456789' });
console.log(campaign);
```

---

## pauseCampaign

Pauses an active campaign, which also pauses all associated ad sets and ads.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `campaignId` | string | Yes | ID of the campaign |

### Example

```javascript
const success = await mcp.call('meta-mcp.pauseCampaign', { campaignId: '123456789' });
console.log(`Operation pause successful`);
```

---

## updateCampaign

Updates an existing campaign with new configuration values.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | object | Yes | Campaign configuration object |
| `campaignId` | string | Yes | ID of the campaign |

### Example

```javascript
const success = await mcp.call('meta-mcp.updateCampaign', { campaignId: '123456789', config: { ... } });
console.log(`Operation update successful`);
```
