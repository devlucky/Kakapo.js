import pathMatch from 'path-match';
import parseUrl from 'parse-url';

const nativeFetch = window.fetch;

export const fakeFetch = (serverRoutes) => {
  return (url, options = {}) => {
    const body = options.body || '';
    const method = options.method || 'GET';
    const methodRoutes = serverRoutes[method];

    const pathname = parseUrl(url).pathname;
    const routeHandler = Object.keys(methodRoutes).find(path => {
      const match = pathMatch()(path);
      return match(pathname);
    });

    if (!routeHandler) {
      return nativeFetch(url, options);
    }

    const query = parseUrl(url).search;
    const match = pathMatch()(routeHandler);
    const params = match(pathname);

    // @TODO: Wrap 'resolve' result into a Response instance,
    // check https://github.com/devlucky/Kakapo.js/issues/16
    return Promise.resolve(routeHandler({params, query, body}));
  };
};

export const reset = () => {
  window.fetch = nativeFetch;
};
