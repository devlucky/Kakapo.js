class Request {

}

class Response {

  constructor(body) {
    this.body = body;
    this.ok = true;
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