import { extendWithBind } from '../helpers/util';
import { Response as KakapoResponse } from '../Response';
import { Request as KakapoRequest } from '../Request';
import { interceptorHelper } from './interceptorHelper';

let nativeXHR;

//TODO: Should this function capitalize each header name? 'content-type' --> 'Content-Type'
const createAllFakeHeaders = (headers) => {
  const fakeHeaders = Object.keys(headers).map(k => `${k}: ${headers[k]}`);

  fakeHeaders.push(''); // This element in the array is important because generates a valid response headers

  return fakeHeaders.join('\n');
};

const fakeHeaders = {
  'content-type': 'application/json; charset=utf-8'
}
const allFakeHeaders = createAllFakeHeaders(fakeHeaders);
const name = 'XMLHttpRequest';
const fakeService = helpers => class XMLHttpRequestInterceptor {
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

  //TODO: Support all handlers 'progress', 'loadstart', 'abort', 'error'
  send(data) {
    const handler = helpers.getHandler(this.url, this.method);
    const xhr = this.xhr;
    const onreadyCallback = this.onreadystatechange;
    const onloadCallback = this.onload;
    const successCallback = onreadyCallback || onloadCallback;

    //Intercept: Fire fake handler
    if (handler && successCallback) {
      const request = new KakapoRequest({
        params: helpers.getParams(this.url, this.method),
        query: helpers.getQuery(this.url),
        body: data,
        headers: this._requestHeaders
      });
      const db = helpers.getDB();
      const response = handler(request, db);
      const readyState = 4;
      let status = 200;
      let payload = response;

      if (response instanceof KakapoResponse) {
        payload = response.body;
        status = response.code;
      }

      const responseString = JSON.stringify(payload);
      
      this.readyState = readyState;
      this.status = status;
      //TODO: should 'this.response' be the response string or the response json?
      this.responseText = this.response = responseString;
      
      return successCallback();
    }

    //Passthrough: Fire normal handler
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

  getResponseHeader(name) {
    return this.xhr.getResponseHeader(name) || fakeHeaders[name];
  }

  getAllResponseHeaders() {
    return this.xhr.getAllResponseHeaders() || allFakeHeaders;
  }
};

export const enable = (config) => {
  nativeXHR = nativeXHR || window.XMLHttpRequest;
  window[name] = fakeService(interceptorHelper(config));
};
export const disable = () => {
  window[name] = nativeXHR;
};