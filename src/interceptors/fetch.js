import queryString from 'query-string';
import pathMatch from 'path-match';
import parseUrl from 'parse-url';

import { interceptor } from './interceptor';
import { nativeFetch } from '../helpers/nativeServices';
import {Response as KakapoResponse} from '../kakapo';

const fakeResponse = function(response = {}, headers = {}) {
  const responseStr = JSON.stringify(response);

  return new window.Response(responseStr, {headers});
};

export const fakeFetch = serverRoutes =>
  interceptor(serverRoutes, (helpers, url, options = {}) => {
    const body = options.body || '';
    const method = options.method || 'GET';
    const headers = options.headers || {};

    const handler = helpers.getHandler(url, method);
    const params = helpers.getParams(url, method);

    if (!handler) {
      return nativeFetch(url, options);
    }

    const query = queryString.parse(parseUrl(url).search);
    const response = handler({params, query, body, headers});

    if (!(response instanceof KakapoResponse)) {
      return Promise.resolve(fakeResponse(response));
    }

    const result = fakeResponse(response.body, response.headers);
    return response.error ? Promise.reject(result) : Promise.resolve(result);
  });
