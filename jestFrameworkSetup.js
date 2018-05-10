// @flow
class Request {

}

// class Body {
//   json() {

//   }
// }
class Response {
  ok = true
  constructor() {

  }

  json() {
    return Promise.resolve();
  }
}

const fetch = () => {
  return Promise.resolve(new Response());
};

global.Request = Request;
global.Response = Response;
global.fetch = fetch;