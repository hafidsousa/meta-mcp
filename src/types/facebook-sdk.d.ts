declare module 'facebook-nodejs-business-sdk' {
  export class Cursor<T> extends Array<T> {
    next(): Promise<Cursor<T>>;
    previous(): Promise<Cursor<T>>;
    hasNext(): boolean;
    hasPrevious(): boolean;
  }

  export class FacebookAdsApi {
    static init(accessToken: string): FacebookAdsApi;
    static setDebug(flag: boolean): void;
    setDebug(flag: boolean): void;
  }

  export class AdAccount {
    id: string;
    constructor(id: string);
    
    // Campaign operations
    createCampaign(fields: string[], params: Record<string, any>): Promise<Campaign>;
    getCampaigns(fields: string[], params?: { limit?: number }): Promise<Cursor<Campaign>>;
    
    // Ad Set operations
    createAdSet(fields: string[], params: Record<string, any>): Promise<AdSet>;
    getAdSets(fields: string[], params?: { limit?: number }): Promise<Cursor<AdSet>>;
    
    // Ad operations
    createAd(fields: string[], params: Record<string, any>): Promise<Ad>;
    getAds(fields: string[], params?: { limit?: number }): Promise<Cursor<Ad>>;
    
    // Creative operations
    createAdCreative(fields: string[], params: Record<string, any>): Promise<AdCreative>;
    getAdCreatives(fields: string[], params?: { limit?: number }): Promise<Cursor<AdCreative>>;
    
    // Audience operations
    getCustomAudiences(fields: string[], params?: { limit?: number }): Promise<Cursor<CustomAudience>>;
    createCustomAudience(fields: string[], params: Record<string, any>): Promise<CustomAudience>;
    
    // Insights
    getInsights(fields: string[], params?: Record<string, any>): Promise<Cursor<Insight>>;
    
    // General operations
    read(fields: string[]): Promise<AdAccount>;
  }

  export class Campaign {
    id: string;
    name: string;
    status: string;
    objective: string;

    constructor(id: string, data?: Record<string, any>);
    
    delete(): Promise<void>;
    update(data: Record<string, any>): Promise<Campaign>;

    static Fields: {
      readonly id: 'id';
      readonly name: 'name';
      readonly objective: 'objective';
      readonly status: 'status';
      readonly special_ad_categories: 'special_ad_categories';
    };

    static Status: {
      readonly ACTIVE: 'ACTIVE';
      readonly PAUSED: 'PAUSED';
      readonly DELETED: 'DELETED';
      readonly ARCHIVED: 'ARCHIVED';
    };

    static Objective: {
      readonly APP_INSTALLS: 'APP_INSTALLS';
      readonly BRAND_AWARENESS: 'BRAND_AWARENESS';
      readonly CONVERSIONS: 'CONVERSIONS';
      readonly LINK_CLICKS: 'LINK_CLICKS';
      readonly PAGE_LIKES: 'PAGE_LIKES';
      readonly REACH: 'REACH';
      readonly VIDEO_VIEWS: 'VIDEO_VIEWS';
    };
  }

  export class AdSet {
    id: string;
    name: string;
    campaign_id: string;

    constructor(id: string, data?: Record<string, any>);
    
    delete(): Promise<void>;
    update(data: Record<string, any>): Promise<AdSet>;

    static Fields: {
      readonly id: 'id';
      readonly name: 'name';
      readonly campaign_id: 'campaign_id';
      readonly daily_budget: 'daily_budget';
      readonly targeting: 'targeting';
      readonly billing_event: 'billing_event';
      readonly optimization_goal: 'optimization_goal';
      readonly bid_amount: 'bid_amount';
      readonly status: 'status';
    };

    static Status: {
      readonly ACTIVE: 'ACTIVE';
      readonly PAUSED: 'PAUSED';
      readonly DELETED: 'DELETED';
      readonly ARCHIVED: 'ARCHIVED';
    };
  }

  export class Ad {
    id: string;
    name: string;
    adset_id: string;
    
    constructor(id: string, data?: Record<string, any>);
    
    delete(): Promise<void>;
    update(data: Record<string, any>): Promise<Ad>;

    static Fields: {
      readonly id: 'id';
      readonly name: 'name';
      readonly adset_id: 'adset_id';
      readonly creative: 'creative';
      readonly status: 'status';
    };

    static Status: {
      readonly ACTIVE: 'ACTIVE';
      readonly PAUSED: 'PAUSED';
      readonly DELETED: 'DELETED';
      readonly ARCHIVED: 'ARCHIVED';
    };
  }

  export class AdCreative {
    id: string;
    name: string;
    
    constructor(id: string, data?: Record<string, any>);
    
    delete(): Promise<void>;
    update(data: Record<string, any>): Promise<AdCreative>;

    static Fields: {
      readonly id: 'id';
      readonly name: 'name';
      readonly object_story_spec: 'object_story_spec';
      readonly image_url: 'image_url';
      readonly video_id: 'video_id';
      readonly call_to_action_type: 'call_to_action_type';
    };
  }

  export class CustomAudience {
    id: string;
    name: string;
    
    constructor(id: string, data?: Record<string, any>);
    
    delete(): Promise<void>;
    update(data: Record<string, any>): Promise<CustomAudience>;

    static Fields: {
      readonly id: 'id';
      readonly name: 'name';
      readonly subtype: 'subtype';
      readonly description: 'description';
    };
  }

  export class Insight {
    static Fields: {
      readonly impressions: 'impressions';
      readonly clicks: 'clicks';
      readonly spend: 'spend';
      readonly reach: 'reach';
      readonly actions: 'actions';
    };
  }
} 