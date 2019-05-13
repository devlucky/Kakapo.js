export interface KakapoRequestOptions {
    params: any;
    query: any;
    body?: any;
    headers: any;
}

export class KakapoRequest {
    params: any;
    query: any;
    body: any | null;
    headers: any;

    constructor(options: KakapoRequestOptions) {
      this.params = options.params || {};
      this.query = options.query || {};
      this.body = options.body || null;
      this.headers = options.headers || {};
    }
}
