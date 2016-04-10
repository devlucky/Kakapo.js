import queryString from 'query-string';
import pathMatch from 'path-match';
import parseUrl from 'parse-url';

const nativeFetch = window.fetch;

//TODO: Handle response headers
let fakeResponse = function(response = {}) {
  const responseStr = JSON.stringify(response);

  return new Response(responseStr);
};

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

    return Promise.resolve(fakeResponse(handler({params, query, body})));
  };
};

export const reset = () => {
  window.fetch = nativeFetch;
};
