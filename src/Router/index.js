// @flow
import _ from "lodash";
import { interceptors } from "../interceptors";
import environment from "../config/environment";
import {
  type InterceptorConfig,
  type RouteHandler
} from "../interceptors/interceptorHelper";

const browserStrategies = ["fetch", "XMLHttpRequest"];
//TODO: find proper name for Node.js strategies
const nodeStrategies = ["http", "https"];
const routerDefaultConfig = {
  strategies: environment.browserEnv ? browserStrategies : nodeStrategies
};

const interceptorDefaultConfig = {
  db: null,
  host: "",
  requestDelay: 0,
  routes: { GET: {}, POST: {}, PUT: {}, DELETE: {} }
};

export type RouterConfig = {
  +strategies: string[]
};

export class Router {
  +interceptorConfig: InterceptorConfig;
  +routerConfig: RouterConfig;

  constructor(
    interceptorConfig: InterceptorConfig,
    routerConfig: RouterConfig
  ) {
    this.interceptorConfig = _.merge(
      {},
      interceptorDefaultConfig,
      interceptorConfig
    );
    this.routerConfig = _.merge({}, routerDefaultConfig, routerConfig);
  }

  get(...args: any[]) {
    this.register("GET", ...args);
  }

  post(...args: any[]) {
    this.register("POST", ...args);
  }

  put(...args: any[]) {
    this.register("PUT", ...args);
  }

  delete(...args: any[]) {
    this.register("DELETE", ...args);
  }

  register(method: string, path: string, handler: RouteHandler) {
    this.interceptorConfig.routes[method][path] = handler;
  }

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
