import { baseInterceptor } from './baseInterceptor';
import { nativeXHR } from '../helpers/nativeServices';

export const name = 'XMLHttpRequest';
export const Reference = nativeXHR;

export const fakeService = config =>
  baseInterceptor(config, class fakeXMLHttpRequest {
    constructor(helpers) {
      this.xhr = new Reference();
      this.getHandler = helpers.getHandler;
      this.getParams = helpers.getParams;

      setXhrState(this, this.xhr);
    }

    //TODO: Handle 'async', 'user', 'password'
    open(method, url, async, user, password) {
      this.method = method;
      this.url = url;
      this.xhr.open(method, url);
    }

    //TODO: Handle 'data' parameter
    send(data) {
      const handler = this.getHandler(this.url, this.method);
      const params = this.getParams(this.url, this.method);
      const successCallback = this.onreadystatechange || this.onload;

      if (handler && successCallback) {
        this.readyState = 4;
        this.status = 200; // @TODO (zzarcon): Support custom status codes
        this.responseText = this.response = handler({ params });
        return successCallback();
      }

      this.xhr.onreadystatechange = () => {
        this.readyState = this.xhr.readyState;
        this.status = this.xhr.status;
        this.responseText = this.xhr.responseText;

        successCallback && successCallback.call(this.xhr);
      };

      return this.xhr.send();
    }
  });

const setXhrState = (fakeInstance, xhr) => {
  for (let prop in xhr) {
    const value = xhr[prop];
    if (!fakeInstance[prop]) {
      fakeInstance[prop] = typeof value === 'function' ? value.bind(xhr) : value;
    }
  }
};