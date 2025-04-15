# Ad Tools

These tools allow you to interact with Facebook Marketing API ad resources.

## Table of Contents

- [createAd](#createad)
- [getAds](#getads)
- [getAd](#getad)
- [pauseAd](#pausead)
- [updateAd](#updatead)

---

## createAd

Creates a new ad within an ad set. Ads are the actual content shown to users.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | object | Yes | Ad configuration object |

### Example

```javascript
const result = await mcp.call('meta-mcp.createAd', { config: { ... } });
console.log(`Created with ID: ${result.id}`);
```

---

## getAds

Gets all ads for a specific ad set.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `adSetId` | string | No | ID of the ad set |
| `adId` | string | Yes | ID of the ad |

### Example

```javascript
const ads = await mcp.call('meta-mcp.getAds', { adSetId: '123456789' });
console.log(ads);
```

---

## getAd

Gets details for a specific ad by ID.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `adId` | string | Yes | ID of the ad |

### Example

```javascript
const ad = await mcp.call('meta-mcp.getAd', { adId: '123456789' });
console.log(ad);
```

---

## pauseAd

Pauses an active ad.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `adId` | string | Yes | ID of the ad |

### Example

```javascript
const success = await mcp.call('meta-mcp.pauseAd', { adId: '123456789' });
console.log(`Operation pause successful`);
```

---

## updateAd

Updates an existing ad with new configuration values.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | object | Yes | Ad configuration object |
| `adId` | string | Yes | ID of the ad |

### Example

```javascript
const success = await mcp.call('meta-mcp.updateAd', { adId: '123456789', config: { ... } });
console.log(`Operation update successful`);
```
