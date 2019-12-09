import * as keys from 'lodash.keys';
import * as includes from 'lodash.includes';
import * as pathMatch from 'path-match';
import * as parseUrl from 'parse-url';
import * as queryString from 'query-string';
import { KakapoRequest } from '../Request';
import { KakapoResponse } from '../Response';
import { Database, DatabaseSchema } from '../Database';

export type RouterHandler<M extends DatabaseSchema> = (
    request: KakapoRequest,
    db: Database<M>
) => KakapoResponse | any | Promise<KakapoResponse | any>;

export interface InterceptorConfig<M extends DatabaseSchema> {
    host: string;
    routes: { [method: string]: { [path: string]: RouterHandler<M> } };
    db: Database<M> | null;
    requestDelay: number;
}

export interface UrlDetails {
    handlers: any;
    pathname: string;
    fullpath: string;
}

const getRoute = <M extends DatabaseSchema>(
  { host }: InterceptorConfig<M>,
  { handlers, pathname, fullpath }: UrlDetails
) => {
  const matchesPathname = (path: string) => pathMatch()(path)(pathname);
  const route = keys(handlers).reduce((result: string | undefined, key: string) => matchesPathname(key) ? key : result, undefined);
  const hasHost = includes(fullpath, host);

  return route && hasHost ? route : null;
};

const extractUrl = <M extends DatabaseSchema>(
  { routes }: InterceptorConfig<M>,
  url: string,
  method: string
) => ({
  handlers: routes[method],
  pathname: parseUrl(url).pathname,
  fullpath: parseUrl(url).href
});

export interface Interceptor<M extends DatabaseSchema> {
    getDB(): Database<M> | null;
    getDelay(): number;
    getHandler(url: string, method: string): RouterHandler<M> | null;
    getParams(url: string, method: string): any;
    getQuery(url: string): any;
}

export const interceptorHelper = <M extends DatabaseSchema>(config: InterceptorConfig<M>): Interceptor<M> => ({
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
