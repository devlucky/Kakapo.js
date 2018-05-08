// @flow
import merge from 'lodash.merge';
import forEach from 'lodash.foreach';
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
  routes: { GET: {}, POST: {}, PUT: {}, DELETE: {}, HEAD: {} }
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
    this.interceptorConfig = merge(
      {},
      interceptorDefaultConfig,
      interceptorConfig
    );
    this.routerConfig = merge({}, routerDefaultConfig, routerConfig);
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

  head(...args: any[]) {
    this.register("HEAD", ...args);
  }  

  register(method: string, path: string, handler: RouteHandler) {
    this.interceptorConfig.routes[method][path] = handler;
  }

  intercept() {
    const strategies = this.routerConfig.strategies;

    forEach(strategies, name =>
      interceptors[name].enable(this.interceptorConfig)
    );
  }

  reset() {
    //TODO: Don't reset all 'interceptors'
    forEach(interceptors, interceptor => interceptor.disable());
  }
}
