import {baseInterceptor} from './baseInterceptor';
import {nativeXHR} from '../helpers/nativeServices';

export const name = 'XMLHttpRequest';
export const Reference = nativeXHR;

// We are not using 'xhr.hasOwnProperty' intentionaly here
export const extend = (target, obj) => {
  for (let prop in obj) {
    const value = obj[prop];
    if (target[value]) return;

    target[prop] = value;
  }
}

export const fakeService = config => {
  const FakeXMLHttpRequest = function(helpers) {
    this.xhr = new Reference();
    this.getHandler = helpers.getHandler;
    this.getParams = helpers.getParams;

    // extend(this, this.xhr);
  };

  FakeXMLHttpRequest.hector = 'zarco';
  extend(FakeXMLHttpRequest.prototype, Reference);
  // extend(FakeXMLHttpRequest, Reference);

  FakeXMLHttpRequest.prototype.open = function(method, url) {
    this.method = method;
    this.url = url;
    this.xhr.open(method, url);
  }

  FakeXMLHttpRequest.prototype.send = function() {
    const handler = this.getHandler(this.url, this.method);
    const params = this.getParams(this.url, this.method);

    if (handler && this.onreadystatechange) {
      this.readyState = 4;
      this.status = 200; // @TODO (zzarcon): Support custom status codes
      this.responseText = handler({params});
      return this.onreadystatechange();
    }

    this.xhr.onreadystatechange = () => {
      this.readyState = this.xhr.readyState;
      this.status = this.xhr.status;
      this.responseText = this.xhr.responseText;
      this.onreadystatechange.call(this.xhr);
    };

    return this.xhr.send();
  }

  debugger
  return baseInterceptor(config, FakeXMLHttpRequest);
};