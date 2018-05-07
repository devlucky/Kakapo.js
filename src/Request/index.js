// @flow

export type RequestOptions = {
  params: any,
  query: any,
  body?: any,
  headers: any
};

export class Request {
  params: any;
  query: any;
  body: any | null;
  headers: any;

  constructor(options: RequestOptions) {
    this.params = options.params || {};
    this.query = options.query || {};
    this.body = options.body || null;
    this.headers = options.headers || {};
  }
}
