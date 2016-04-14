export class Response {
  constructor(code = 200, body = {}, headers = {}) {
    this.code = code;
    this.body = body;
    this.headers = headers;
  }

  get error() {
    return this.code >= 400;
  }

  get ok() {
    return this.code >= 200 && this.code <= 299;
  }
}
