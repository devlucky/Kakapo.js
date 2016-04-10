import queryString from 'query-string';
import pathMatch from 'path-match';
import parseUrl from 'parse-url';

const nativeFetch = window.fetch;

export const fakeFetch = (serverRoutes) => {
  return (url, options = {}) => {
    const body = options.body || '';
    const method = options.method || 'GET';
    const handlers = serverRoutes[method];

    const pathname = parseUrl(url).pathname;
    const matchesPathname = path => pathMatch()(path)(pathname);
    const route = Object.keys(handlers).find(matchesPathname);

    if (!route) {
      return nativeFetch(url, options);
    }

    const handler = handlers[route];
    const query = queryString.parse(parseUrl(url).search);
    const params = matchesPathname(route);

    // @TODO: Wrap 'resolve' result into a Response instance,
    // check https://github.com/devlucky/Kakapo.js/issues/16
    return Promise.resolve(handler({params, query, body}));
  };
};

export const reset = () => {
  window.fetch = nativeFetch;
};
