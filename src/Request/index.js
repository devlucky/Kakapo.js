export class Request {
  constructor(options) {
    this.params = options.params || {};
    this.query = options.query || {};
    this.body = options.body || null;
    this.headers = options.headers || {};
  }
}