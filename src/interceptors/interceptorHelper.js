import _ from 'lodash';
import pathMatch from 'path-match';
import parseUrl from 'parse-url';
import queryString from 'query-string';

// @TODO (oskar): This NEEDS refactor.
const getRoute = ({ host }, { handlers, pathname, fullpath }) => {
  const matchesPathname = path => pathMatch()(path)(pathname);
  const route = _.keys(handlers).find(matchesPathname);
  const hasHost = _.includes(fullpath, host);

  return route && hasHost ? route : null;
};

const extractUrl = ({ routes }, url, method) => ({
  handlers: routes[method],
  pathname: parseUrl(url).pathname,
  fullpath: parseUrl(url).href,
});

export const interceptorHelper = (config) => ({
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
  },
});
