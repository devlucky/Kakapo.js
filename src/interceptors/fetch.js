import queryString from 'query-string';
import pathMatch from 'path-match';
import parseUrl from 'parse-url';
import {Response} from '../kakapo';

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
    const handlerResponse = handler({params, query, body});

    if (handlerResponse instanceof Response) {
      if (handlerResponse.isErrored) {
        return Promise.reject(handlerResponse.body);
      }

      return Promise.resolve(handlerResponse.body);
    }
    // @TODO: Wrap 'resolve' result into a Response instance,
    // check https://github.com/devlucky/Kakapo.js/issues/16
    return Promise.resolve(handlerResponse);
  };
};

export const reset = () => {
  window.fetch = nativeFetch;
};
