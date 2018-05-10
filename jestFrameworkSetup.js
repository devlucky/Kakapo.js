// @flow
class Request {

}

// class Body {
//   json() {

//   }
// }
class Response {
  body: any;
  ok = true

  constructor(body: any) {
    this.body = body;
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
}

const fetch = () => {
  return Promise.resolve(new Response());
};

global.Request = Request;
global.Response = Response;
global.fetch = fetch;