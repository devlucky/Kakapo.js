import { baseInterceptor, getQuery } from './baseInterceptor';
import { Response as KakapoResponse } from '../Response';
import { nativeFetch } from '../helpers/nativeServices';

export const name = 'fetch';
export const reference = nativeFetch;

const fakeResponse = (response = {}, headers = {}) => {
  const responseStr = JSON.stringify(response);
  return new window.Response(responseStr, { headers });
};

export const fakeService = config => {
  return baseInterceptor(config, (helpers, url, options = {}) => {
    url = url instanceof Request ? url.url : url;
    const {getHandler, getParams} = helpers;
    const method = options.method || 'GET';
    const handler = getHandler(url, method);

    if (!handler) {
      return reference(url, options);
    }

    const request = {
      params: getParams(url, method),
      query: getQuery(url),
      headers: options.headers || {},
      body: options.body || ''
    };
    const {db} = config;
    const response = handler(request, db);

    if (!(response instanceof KakapoResponse)) {
      return new Promise((resolve) => setTimeout(
        () => resolve(fakeResponse(response)),
        config.requestDelay
      ));
    }

    const result = fakeResponse(response.body, response.headers);
    return new Promise((resolve, reject) => setTimeout(
      () => {
        if (response.error) { return reject(result); }
        return resolve(result);
      },
      config.requestDelay
    ));
  })
};
