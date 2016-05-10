import _ from 'lodash';
import pathMatch from 'path-match';
import parseUrl from 'parse-url';

export const baseInterceptor = ({ routes, host }, fakeService) => {
  const getRoute = ({ handlers, pathname, fullpath }) => {
    const matchesPathname = path => pathMatch()(path)(pathname);
    const route = _.keys(handlers).find(matchesPathname);
    const hasHost = _.includes(fullpath, host);

    return route && hasHost ? route : null;
  };

  const extractUrl = (url, method) => ({
    handlers: routes[method],
    pathname: parseUrl(url).pathname,
    fullpath: parseUrl(url).href,
  });

  const getHandler = (url, method) => {
    const extractedUrl = extractUrl(url, method);
    const route = getRoute(extractedUrl);

    return route ? extractedUrl.handlers[route] : null;
  };

  const getParams = (url, method) => {
    const extractedUrl = extractUrl(url, method);
    const matchesPathname = path => pathMatch()(path)(extractedUrl.pathname);
    const route = getRoute(extractedUrl);

    return route ? matchesPathname(route) : null;
  };

  return fakeService.bind(null, { getHandler, getParams });
};
