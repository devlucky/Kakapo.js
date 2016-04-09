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
    if (strategies.indexOf('fetch') > -1) {
      window.fetch = fakeFetch(this.routes);
    }

    if (strategies.indexOf('XMLHttpRequest') > -1) {
      window.XMLHttpRequest = fakeXMLHttpRequest(this.routes);
    }
  }

  reset() {
    resetFetch();
    resetXMLHttpRequest();   
  }
}