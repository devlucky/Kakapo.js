import _ from 'lodash';

import { baseInterceptor, getQuery } from './baseInterceptor';
import { nativeXHR } from '../helpers/nativeServices';
import { extendWithBind } from '../helpers/util';

// @TODO (oskar): Support all handlers 'progress', 'loadstart', 'abort', 'error'
class XMLHttpRequestInterceptor {
  constructor(helpers) {
    this.xhr = new nativeXHR();
    this.getHandler = helpers.getHandler;
    this.getParams = helpers.getParams;
    this._requestHeaders = {};

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
    this._requestHeaders[name] = value;
    this.xhr.setRequestHeader(name, value);
    this.readyState = this.xhr.readyState;
  }

  // @TODO (zzarcon): Handle 'data' parameter
  send() {
    const handler = this.getHandler(this.url, this.method);
    const xhr = this.xhr;
    const onreadyCallback = this.onreadystatechange;
    const onloadCallback = this.onload;
    const successCallback = onreadyCallback || onloadCallback;

    if (handler && successCallback) {
      const params = this.getParams(this.url, this.method);
      const query = getQuery(this.url);
      const headers = this._requestHeaders;

      this.readyState = 4;
      this.status = 200; // @TODO (zzarcon): Support custom status codes
      // @TODO (zzarcon): Pass 'body' to handler
      this.responseText = this.response = handler({params, query, headers});

      return successCallback();
    }

    xhr.onreadystatechange = () => {
      _.assign(this, xhr);
      if (onreadyCallback) { onreadyCallback.call(xhr); }
    };

    xhr.onload = () => {
      if (onloadCallback) { onloadCallback.call(xhr); }
    };

    return xhr.send();
  }
}

export const name = 'XMLHttpRequest';
export const Reference = nativeXHR;
export const fakeService = config =>
  baseInterceptor(config, XMLHttpRequestInterceptor);
