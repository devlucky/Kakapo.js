import _ from 'lodash';
import { interceptors } from '../interceptors';

const routerDefaultConfig = {
  strategies: ['fetch', 'XMLHttpRequest']
};

const interceptorDefaultConfig = {
  host: '',
  requestDelay: 0,
  routes: {GET: {}, POST: {}, PUT: {}, DELETE: {}}
};

export class Router {
  constructor(interceptorConfig, routerConfig) {
    this.interceptorConfig = _.merge({}, interceptorDefaultConfig, interceptorConfig);
    this.routerConfig = _.merge({}, routerDefaultConfig, routerConfig);

    this.intercept();
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
    this.interceptorConfig.routes[method][path] = handler;
  }

  intercept() {
    const strategies = this.routerConfig.strategies;
    _.forEach(strategies, name =>
      interceptors[name].enable(this.interceptorConfig));
  }

  reset() {
    _.forEach(interceptors, interceptor => interceptor.disable());
  }
}
