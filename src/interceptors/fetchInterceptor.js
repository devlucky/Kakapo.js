import { Response as KakapoResponse } from '../Response';
import { nativeFetch } from '../helpers/nativeServices';

const fakeResponse = (response = {}, headers = {}) => {
  const responseStr = JSON.stringify(response);
  return new window.Response(responseStr, { headers });
};

export const name = 'fetch';
export const reference = nativeFetch;
export const fakeService = helpers => (url, options = {}) => {
  url = url instanceof Request ? url.url : url;

  const body = options.body || '';
  const method = options.method || 'GET';
  const headers = options.headers || {};

  const handler = helpers.getHandler(url, method);
  const params = helpers.getParams(url, method);

  if (!handler) {
    return nativeFetch(url, options);
  }

  const query = helpers.getQuery(url);
  const response = handler({ params, query, body, headers });

  if (!(response instanceof KakapoResponse)) {
    return new Promise((resolve) => setTimeout(
      () => resolve(fakeResponse(response)),
      helpers.getDelay()
    ));
  }

  const result = fakeResponse(response.body, response.headers);
  return new Promise((resolve, reject) => setTimeout(
    () => {
      if (response.error) { return reject(result); }
      return resolve(result);
    },
    helpers.getDelay()
  ));
};
