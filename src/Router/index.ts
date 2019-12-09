import * as merge from 'lodash.merge';
import * as forEach from 'lodash.foreach';
import { interceptors, Interceptors } from '../interceptors';
import environment from '../config/environment';
import {
  InterceptorConfig,
  RouterHandler
} from '../interceptors/interceptorHelper';
import { DatabaseSchema } from '../Database';

const browserStrategies = ['fetch', 'XMLHttpRequest'];
//TODO: find proper name for Node.js strategies
const nodeStrategies = ['http', 'https'];
const routerDefaultConfig = {
  strategies: environment.browserEnv ? browserStrategies : nodeStrategies
};

const interceptorDefaultConfig: InterceptorConfig<any> = {
  db: null,
  host: '',
  requestDelay: 0,
  routes: { GET: {}, POST: {}, PUT: {}, DELETE: {}, HEAD: {} }
};

export interface RouterConfig {
    strategies: (keyof Interceptors)[];
}

export class Router<M extends DatabaseSchema> {
    interceptorConfig: InterceptorConfig<M>;
    routerConfig: RouterConfig;

    constructor(
      interceptorConfig: Partial<InterceptorConfig<M>> = interceptorDefaultConfig,
      routerConfig: RouterConfig = { strategies: [] }
    ) {
      this.interceptorConfig = merge(
        {},
        interceptorDefaultConfig,
        interceptorConfig
      );
      this.routerConfig = merge({}, routerDefaultConfig, routerConfig);
    }

    get(path: string, handler: RouterHandler<M>) {
      this.register('GET', path, handler);
    }

    post(path: string, handler: RouterHandler<M>) {
      this.register('POST', path, handler);
    }

    put(path: string, handler: RouterHandler<M>) {
      this.register('PUT', path, handler);
    }

    delete(path: string, handler: RouterHandler<M>) {
      this.register('DELETE', path, handler);
    }

    head(path: string, handler: RouterHandler<M>) {
      this.register('HEAD', path, handler);
    }

    register(method: string, path: string, handler: RouterHandler<M>) {
      this.interceptorConfig.routes[method][path] = handler;
    }

    intercept() {
      const strategies = this.routerConfig.strategies;

      forEach(strategies, (name: keyof Interceptors) =>
        interceptors[name].enable(this.interceptorConfig)
      );
    }

    reset() {
    //TODO: Don't reset all 'interceptors'
      forEach(interceptors, (interceptor: Interceptors[keyof Interceptors]) => interceptor.disable());
    }
}
