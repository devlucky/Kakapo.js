import { nativeXHR } from '../helpers/nativeServices';
import { extendWithBind } from '../helpers/util';
import { Request as KakapoRequest } from '../Request';

export const name = 'XMLHttpRequest';
export const Reference = nativeXHR;
export const fakeService = helpers => class XMLHttpRequestInterceptor {
  constructor() {
    this.xhr = new nativeXHR();
    this._requestHeaders = {};

    extendWithBind(this, this.xhr);
  }

  //TODO: Handle 'async', 'user', 'password'
  open(method, url, async, user, password) {
    this.method = method;
    this.url = url;
    this.xhr.open(method, url);
  }

  //TODO: Handle 'data' parameter
  //TODO: Support all handlers 'progress', 'loadstart', 'abort', 'error'
  send(data) {
    const handler = helpers.getHandler(this.url, this.method);
    const xhr = this.xhr;
    const onreadyCallback = this.onreadystatechange;
    const onloadCallback = this.onload;
    const successCallback = onreadyCallback || onloadCallback;

    if (handler && successCallback) {
      //TODO: Pass 'body' to KakapoRequest
      const request = new KakapoRequest({
        params: helpers.getParams(this.url, this.method),
        query: helpers.getQuery(this.url),
        headers: this._requestHeaders
      });
      const db = helpers.getDB();

      this.readyState = 4;
      this.status = 200; // @TODO (zzarcon): Support custom status codes
      this.responseText = this.response = handler(request, db);

      return successCallback();
    }

    //TODO: Automatically set all the properties
    xhr.onreadystatechange = () => {
      this.readyState = xhr.readyState;
      this.response = xhr.response;
      this.responseText = xhr.responseText;
      this.responseType = xhr.responseType;
      this.responseXML = xhr.responseXML;
      this.status = xhr.status;
      this.statusText = xhr.statusText;

      return onreadyCallback && onreadyCallback.call(xhr);
    };

    xhr.onload = () => {
      onloadCallback && onloadCallback.call(xhr);
    };

    return xhr.send();
  }

  setRequestHeader(name, value) {
    this._requestHeaders[name] = value;

    this.xhr.setRequestHeader(name, value);
  }
};
