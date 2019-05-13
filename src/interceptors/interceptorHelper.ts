import { keys, includes } from 'lodash';
import * as pathMatch from 'path-match';
import * as parseUrl from 'parse-url';
import * as queryString from 'query-string';
import { KakapoRequest } from '../Request';
import { KakapoResponse } from '../Response';
import { Database } from '../Database';

export type RouteHandler = (
    request: KakapoRequest,
    db: Database<any>
) => KakapoResponse | any | Promise<KakapoResponse | any>;

export interface InterceptorConfig {
    host: string;
    routes: { [method: string]: { [path: string]: RouteHandler } };
    db: any;
    requestDelay: number;
}

export interface UrlDetails {
    handlers: any;
    pathname: string;
    fullpath: string;
}

// @TODO (oskar): This NEEDS refactor.
const getRoute = (
  { host }: InterceptorConfig,
  { handlers, pathname, fullpath }: UrlDetails
) => {
  const matchesPathname = (path: string) => pathMatch()(path)(pathname);
  const route = keys(handlers).reduce((result: string | undefined, key: string) => matchesPathname(key) ? key : result, undefined);
  const hasHost = includes(fullpath, host);

  return route && hasHost ? route : null;
};

const extractUrl = (
  { routes }: InterceptorConfig,
  url: string,
  method: string
) => ({
  handlers: routes[method],
  pathname: parseUrl(url).pathname,
  fullpath: parseUrl(url).href
});

export interface Interceptor {
    getDB(): any;
    getDelay(): number;
    getHandler(url: string, method: string): RouteHandler | null;
    getParams(url: string, method: string): any;
    getQuery(url: string): any;
}

export const interceptorHelper = (config: InterceptorConfig): Interceptor => ({
  getDB() {
    return config.db;
  },
  getDelay() {
    return config.requestDelay;
  },
  getHandler(url, method) {
    const extractedUrl = extractUrl(config, url, method);
    const route = getRoute(config, extractedUrl);

    return route ? extractedUrl.handlers[route] : null;
  },
  getParams(url, method) {
    const extractedUrl = extractUrl(config, url, method);
    const matchesPathname = (path: string) => pathMatch()(path)(extractedUrl.pathname);
    const route = getRoute(config, extractedUrl);

    return route ? matchesPathname(route) : null;
  },
  getQuery(url) {
    return queryString.parse(parseUrl(url).search);
  }
});
