import { Response as KakapoResponse } from '../Response';
import { Request as KakapoRequest } from '../Request';
import { interceptorHelper } from './interceptorHelper';

let nativeFetch;
const fakeResponse = (response = {}, options = {}) => {
  const responseStr = JSON.stringify(response);
  return new window.Response(responseStr, options);
};
const name = 'fetch';
const fakeService = helpers => (url, options = {}) => {
  url = url instanceof Request ? url.url : url;

  const method = options.method || 'GET';
  const handler = helpers.getHandler(url, method);

  if (!handler) {
    return nativeFetch(url, options);
  }

  const request = new KakapoRequest({
    params: helpers.getParams(url, method),
    query: helpers.getQuery(url),
    body: options.body || '',
    headers: options.headers || {}
  });
  const db = helpers.getDB();
  const response = handler(request, db);

  if (response instanceof Promise) {
    //TODO: Should we handle 'requestDelay' also for async responses?
    return response.then(data => fakeResponse(data));
  }

  if (!(response instanceof KakapoResponse)) {
    return new Promise((resolve) => setTimeout(
      () => resolve(fakeResponse(response)),
      helpers.getDelay()
    ));
  }

  const result = fakeResponse(response.body, Object.assign({}, response.options, { headers: response.headers, status: response.code } );
  return new Promise((resolve, reject) => setTimeout(
    () => {
      if (response.error) { return reject(result); }
      return resolve(result);
    },
    helpers.getDelay()
  ));
};

export const enable = (config) => {
  nativeFetch = nativeFetch || window.fetch;
  window[name] = fakeService(interceptorHelper(config));
};
export const disable = () => {
  window[name] = nativeFetch;
};
