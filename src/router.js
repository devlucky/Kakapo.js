import _ from 'lodash';
import { interceptors } from './interceptors';

const defaultConfig = {
  host: '',
  strategies: ['fetch', 'XMLHttpRequest']
};

export class Router {
  constructor(config) {
    this.config = _.assign({}, defaultConfig, config);
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
    const routes = this.routes;
    const host = this.config.host;

    _.forEach(strategies, name => interceptors[name].enable(routes, host));
  }

  reset() {
    _.forEach(interceptors, interceptor => interceptor.disable());
  }
}
