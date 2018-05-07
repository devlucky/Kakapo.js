// @flow

export class Response {
  code: number;
  body: any;
  headers: { [header: string]: string };
  
  constructor(
    code: number = 200,
    body: any = {},
    headers: { [header: string]: string } = {}
  ) {
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
