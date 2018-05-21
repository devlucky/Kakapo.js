// @flow

import keys from 'lodash/keys';
import includes from 'lodash/includes';
import pathMatch from "path-match";
import parseUrl from "parse-url";
import queryString from "query-string";
import { Request } from "../Request";
import { Response } from "../Response";
import { Database } from '../Database';

export type RouteHandler = (request: Request, db: Database<any>) => Response | any;

export type InterceptorConfig = {
  +host: string,
  +routes: { [method: string]: { [path: string]: RouteHandler } },
  +db: any,
  +requestDelay: number
};

export type UrlDetails = {
  +handlers: any,
  +pathname: string,
  +fullpath: string
};

// @TODO (oskar): This NEEDS refactor.
const getRoute = (
  { host }: InterceptorConfig,
  { handlers, pathname, fullpath }: UrlDetails
) => {
  const matchesPathname = path => pathMatch()(path)(pathname);
  const route = keys(handlers).find(matchesPathname);
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
    const matchesPathname = path => pathMatch()(path)(extractedUrl.pathname);
    const route = getRoute(config, extractedUrl);

    return route ? matchesPathname(route) : null;
  },
  getQuery(url) {
    return queryString.parse(parseUrl(url).search);
  }
});
