import pathToRegexp from 'path-to-regexp';
let routes;
const nativeXMLHttpRequest = window.XMLHttpRequest;

export const fakeXMLHttpRequest = (serverRoutes) => {
  routes = serverRoutes;

  return class fakeXMLHttpRequest {
    constructor() {
      
    }

    open(method, url) {
      this.method = method;
      this.url = url;
    }

    send() {
      
    }
  }
}

export const reset = () => {
  window.XMLHttpRequest = nativeXMLHttpRequest;
}