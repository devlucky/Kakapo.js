import queryString from 'query-string';
import pathMatch from 'path-match';
import parseUrl from 'parse-url';

import { baseInterceptor } from './baseInterceptor';
import { Response as KakapoResponse } from '../Response';

export const name = 'fetch';
export const reference = window.fetch;

const fakeResponse = function(response = {}, headers = {}) {
  const responseStr = JSON.stringify(response);

  return new window.Response(responseStr, {headers});
};

export const fakeService = config =>
  baseInterceptor(config, (helpers, url, options = {}) => {
    const body = options.body || '';
    const method = options.method || 'GET';
    const headers = options.headers || {};

    const handler = helpers.getHandler(url, method);
    const params = helpers.getParams(url, method);

    if (!handler) {
      return reference(url, options);
    }

    const query = queryString.parse(parseUrl(url).search);
    const response = handler({params, query, body, headers});

    if (!(response instanceof KakapoResponse)) {
      return new Promise((resolve, reject) => setTimeout(() =>
        resolve(fakeResponse(response)), config.requestDelay));
    }

    const result = fakeResponse(response.body, response.headers);
    return new Promise((resolve, reject) => setTimeout(() =>
      response.error ? reject(result) : resolve(result), config.requestDelay));
  });
