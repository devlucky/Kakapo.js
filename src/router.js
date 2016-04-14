import _ from 'lodash';
import { interceptors } from './interceptors';

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
    this.register('GET', ...args);
  }

  post(...args) {
    this.register('POST', ...args);
  }

  put(...args) {
    this.register('PUT', ...args);
  }

  delete(...args) {
    this.register('DELETE', ...args);
  }

  register(method, path, handler) {
    this.routes[method][path] = handler;
  }

  intercept(strategies) {
    _.forEach(strategies, name => interceptors[name].enable(this.routes));
  }

  reset() {
    _.forEach(interceptors, interceptor => interceptor.disable());
  }
}
