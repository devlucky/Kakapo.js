import queryString from 'query-string';
import pathMatch from 'path-match';
import parseUrl from 'parse-url';

import { interceptor } from './interceptor';

const NativeXMLHttpRequest = window.XMLHttpRequest;

export const fakeXMLHttpRequest = serverRoutes =>
  interceptor(serverRoutes, class fakeXMLHttpRequest {
    constructor(helpers) {
      this.xhr = new NativeXMLHttpRequest();
      this.getHandler = helpers.getHandler;
      this.getParams = helpers.getParams;
    }

    open(method, url) {
      this.method = method;
      this.url = url;
      this.xhr.open(method, url);
    }

    send() {
      const handler = this.getHandler(this.url, this.method);
      const params = this.getParams(this.url, this.method);

      if (handler && this.onreadystatechange) {
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
  });

export const reset = () => {
  window.XMLHttpRequest = NativeXMLHttpRequest;
};
