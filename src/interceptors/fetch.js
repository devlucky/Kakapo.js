import queryString from 'query-string';
import pathMatch from 'path-match';
import parseUrl from 'parse-url';
import {Response as KakapoResponse} from '../kakapo';

const nativeFetch = window.fetch;

//TODO: Handle response headers
const fakeResponse = function(response = {}, headers = {}) {
  const responseStr = JSON.stringify(response);

  return new window.Response(responseStr, {headers});
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
    const handlerResponse = handler({params, query, body});

    if (handlerResponse instanceof KakapoResponse) {
      const result = fakeResponse(handlerResponse.body, handlerResponse.headers);
      if (handlerResponse.isErrored) {
        return Promise.reject(result);
      }

      return Promise.resolve(result);
    }

    return Promise.resolve(fakeResponse(handlerResponse));
  };
};

export const reset = () => {
  window.fetch = nativeFetch;
};
