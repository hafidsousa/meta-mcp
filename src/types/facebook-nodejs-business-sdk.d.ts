declare module 'facebook-nodejs-business-sdk' {
  export class FacebookAdsApi {
    static init(accessToken: string): FacebookAdsApi;
    call<T>(method: string, path: string, params?: Record<string, any>): Promise<T>;
  }

  export class Campaign {
    constructor(id: string);
    update(data: { status?: string }): Promise<Campaign>;
    id: string;
  }

  export class AdSet {
    constructor(id: string);
    update(data: { status?: string }): Promise<AdSet>;
    id: string;
  }

  export class Ad {
    constructor(id: string);
    update(data: { status?: string }): Promise<Ad>;
    id: string;
  }

  export class AdAccount {
    constructor(id: string);
  }
} 