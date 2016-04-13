import { fakeXMLHttpRequest } from './interceptors/xmlhttprequest';
import { fakeFetch } from './interceptors/fetch';
import { nativeFetch, NativeXMLHttpRequest } from './helpers/nativeServices';

const defaultConfig = {
  strategies: ['fetch', 'XMLHttpRequest']
};

export class Router {
  //TODO: Support 'config.host'
  constructor(config) {
    this.config = Object.assign(defaultConfig, config);
    this.routes = {GET: {}, POST: {}, PUT: {}, DELETE: {}};
    this.intercept(this.config.strategies);
  }

  get(...args) {
    this.register(...['GET', ...args]);
  }

  post(...args) {
    this.register(...['POST', ...args]);
  }

  put(...args) {
    this.register(...['PUT', ...args]);
  }

  delete(...args) {
    this.register(...['DELETE', ...args]);
  }

  register(method, path, handler) {
    this.routes[method][path] = handler;
  }

  intercept(strategies) {
    if (!!~strategies.indexOf('fetch')) {
      window.fetch = fakeFetch(this.routes);
    }

    if (!!~strategies.indexOf('XMLHttpRequest')) {
      window.XMLHttpRequest = fakeXMLHttpRequest(this.routes);
    }
  }

  reset() {
    window.fetch = nativeFetch;
    window.XMLHttpRequest = NativeXMLHttpRequest;
  }
}
