import _ from 'lodash';
import { interceptors } from '../interceptors';
import environment from '../config/environment';

const browserStrategies = ['fetch', 'XMLHttpRequest'];
//TODO: find proper name for Node.js strategies
const nodeStrategies = ['https']; //, 'https'
const routerDefaultConfig = {
  strategies: environment.browserEnv ? browserStrategies : nodeStrategies
};

const interceptorDefaultConfig = {
  db: null,
  host: '',
  requestDelay: 0,
  routes: { GET: {}, POST: {}, PUT: {}, DELETE: {} },
};

export class Router {
  constructor(interceptorConfig, routerConfig) {
    this.interceptorConfig = _.merge({}, interceptorDefaultConfig, interceptorConfig);
    this.routerConfig = _.merge({}, routerDefaultConfig, routerConfig);
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

  /**
   * Enable all active strategies, check 'enable' function of any interceptor
   */
  intercept() {
    const strategies = this.routerConfig.strategies;

    _.forEach(strategies, name =>
      interceptors[name].enable(this.interceptorConfig)
    );
  }

  reset() {
    //TODO: Don't reset all 'interceptors'
    _.forEach(interceptors, interceptor => interceptor.disable());
  }
}
