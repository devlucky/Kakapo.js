import queryString from 'query-string';
import pathMatch from 'path-match';
import parseUrl from 'parse-url';

const NativeXMLHttpRequest = window.XMLHttpRequest;

export const fakeXMLHttpRequest = serverRoutes => class fakeXMLHttpRequest {
  constructor() {
    this.xhr = new NativeXMLHttpRequest();
  }

  open(method, url) {
    this.method = method;
    this.url = url;
    this.xhr.open(method, url);
  }

  send() {
    const handlers = serverRoutes[this.method];
    const pathname = parseUrl(this.url).pathname;
    const matchesPathname = path => pathMatch()(path)(pathname);
    const route = Object.keys(handlers).find(matchesPathname);

    if (route && this.onreadystatechange) {
      const handler = handlers[route];
      const params = matchesPathname(route);

      this.readyState = 4;
      this.status = 200; //TODO: Support custom status codes
      this.responseText = handler({params});
      this.onreadystatechange();
      return;
    }

    this.xhr.onreadystatechange = () => {
      this.readyState = this.xhr.readyState;
      this.status = this.xhr.status;
      this.responseText = this.xhr.responseText;
      this.onreadystatechange.call(this.xhr);
    };

    this.xhr.send();
  }
};

export const reset = () => {
  window.XMLHttpRequest = NativeXMLHttpRequest;
};
