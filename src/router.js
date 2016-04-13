import {fakeXMLHttpRequest, reset as resetXMLHttpRequest} from './interceptors/xmlhttprequest';
import {fakeFetch, reset as resetFetch} from './interceptors/fetch';

const defaultConfig = {strategies: ['fetch', 'XMLHttpRequest']};

export class Router {
  //TODO: Support 'config.host'
  constructor(config) {
    this.config = Object.assign(defaultConfig, config);
    this.routes = {GET: {}, POST: {}, PUT: {}, DELETE: {}};
    this.intercept(this.config.strategies);
  }

  get(...args) {
    this.request('GET', ...args);
  }

  post(...args) {
    this.request('POST', ...args);
  }

  put(...args) {
    this.request('PUT', ...args);
  }

  delete(...args) {
    this.request('DELETE', ...args);
  }

  request(method, ...args) {
    this.register(method, ...args);
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
    resetFetch();
    resetXMLHttpRequest();
  }
}
