export class Response {
  constructor(code = 200, body = {}, headers) {
    this.code = code;
    this.body = body;
    this.headers = headers;
  }

  get isErrored() {
    return this.code >= 400 ? true : false;
  }
}