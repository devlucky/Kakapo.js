import queryString from 'query-string';
import pathMatch from 'path-match';
import parseUrl from 'parse-url';

export const interceptor = (serverRoutes, fakeService) => {
  const getRoute = (handlers, pathname) => {
    const matchesPathname = path => pathMatch()(path)(pathname);
    const route = _.keys(handlers).find(matchesPathname);

    return route || undefined;
  };

  const extractUrl = (url, method) => ({
    handlers: serverRoutes[method],
    pathname: parseUrl(url).pathname
  });

  const getHandler = (url, method) => {
    const { handlers, pathname } = extractUrl(url, method);
    const route = getRoute(handlers, pathname);

    return route ? handlers[route] : undefined;
  };

  const getParams = (url, method) => {
    const {handlers, pathname} = extractUrl(url, method);
    const matchesPathname = path => pathMatch()(path)(pathname);
    const route = getRoute(handlers, pathname);

    return route ? matchesPathname(route) : undefined;
  };

  return fakeService.bind(null, {getHandler, getParams});
};
