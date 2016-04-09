import pathToRegexp from 'path-to-regexp';
let routes;
const nativeXMLHttpRequest = window.XMLHttpRequest;

export const fakeXMLHttpRequest = (serverRoutes) => {
  routes = serverRoutes;

  return class fakeXMLHttpRequest {
    constructor() {
      this.xhr = new nativeXMLHttpRequest(); 
    }

    open(method, url) {
      this.method = method;
      this.url = url;
      this.xhr.open(method, url);
    }

    send() {
      let self = this;
      const url = self.url;
      const onreadystatechange = self.onreadystatechange;
      const method = self.method;
      const methodRoutes = routes[method];
      let routeHandler;
      let params;

      Object.keys(methodRoutes).forEach((path) => {
        let routeRegex = pathToRegexp(path);

        if (!routeHandler && routeRegex.exec(url)) {
          routeHandler = methodRoutes[path];
          params = routeRegex.exec(url);
        }
      });

      if (routeHandler && onreadystatechange) {
        self.readyState = 4;
        self.status = 200; //TODO: Support custom status codes
        self.responseText = routeHandler({params});
        onreadystatechange();
        return;
      }
      
      this.xhr.onreadystatechange = function() {
        self.readyState = this.readyState;
        self.status = this.status;
        self.responseText = this.responseText;
        onreadystatechange.call(this);
      };
      this.xhr.send();
    }
  }
}

export const reset = () => {
  window.XMLHttpRequest = nativeXMLHttpRequest;
}