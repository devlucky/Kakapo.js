import _ from 'lodash';

import { nativeXHR } from '../helpers/nativeServices';
import { extendWithBind } from '../helpers/util';

const requestHeaders = new WeakMap();

// @TODO (oskar): Support all handlers 'progress', 'loadstart', 'abort', 'error'
export const name = 'XMLHttpRequest';
export const Reference = nativeXHR;
export const fakeService = helpers => class XMLHttpRequestInterceptor {
  constructor() {
    this.xhr = new nativeXHR();
    requestHeaders.set(this, new Map());
    extendWithBind(this, this.xhr);
  }

  // @TODO (zzarcon): Handle 'async', 'user', 'password'
  //       (oskar): I think just passing them to this.xhr.open would be fine?
  open(method, url) {
    this.method = method;
    this.url = url;
    this.xhr.open(method, url);
    this.readyState = this.xhr.readyState;
  }

  setRequestHeader(name, value) {
    requestHeaders.get(this).set(name, value);
    this.xhr.setRequestHeader(name, value);
  }

  // @TODO (zzarcon): Handle 'data' parameter
  send() {
    const onreadyCallback = this.onreadystatechange;
    const onloadCallback = this.onload;

    const handler = helpers.getHandler(this.url, this.method);
    const successCallback = onreadyCallback || onloadCallback;
    if (handler && successCallback) {
      const handlerResponse = {
        headers: requestHeaders.get(this),
        params: helpers.getParams(this.url, this.method),
        query: helpers.getQuery(this.url),
      };

      this.readyState = 4;
      this.status = 200; // @TODO (zzarcon): Support custom status codes

      // @TODO (zzarcon): Pass 'body' to handler
      this.responseText = this.response = handler(handlerResponse);

      return successCallback();
    }

    this.xhr.onreadystatechange = () => {
      _.extend(this, this.xhr);
      if (onreadyCallback) { onreadyCallback.call(this.xhr); }
    };

    this.xhr.onload = () => {
      if (onloadCallback) { onloadCallback.call(this.xhr); }
    };

    return this.xhr.send();
  }
};
