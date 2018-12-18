// @flow
import { Response as KakapoResponse } from "../Response";
import { Request as KakapoRequest } from "../Request";
import {
  interceptorHelper,
  Interceptor,
  type InterceptorConfig
} from "./interceptorHelper";
import { mapRequestInfoToUrlString, canUseWindow } from "../utils";

const nativeFetch = canUseWindow && window.fetch;
const fakeResponse = (response = {}, headers = {}) => {
  const responseStr = JSON.stringify(response);
  return new Response(responseStr, { headers });
};

export class FakeFetch {
  interceptors: Interceptor[];

  constructor() {
    this.interceptors = [];
  }

  use(config: InterceptorConfig) {
    this.interceptors.push(interceptorHelper(config));
  }

  fake() {
    return (
      requestInfo: RequestInfo,
      options: RequestOptions = {}
    ): Promise<Response> => {
      const url = mapRequestInfoToUrlString(requestInfo);
      const method = options.method || "GET";

      const interceptor = this.interceptors.find(
        i => i.getHandler(url, method) !== null
      );

      if (!interceptor) {
        return nativeFetch(url, options);
      }

      const handler = interceptor.getHandler(url, method);

      if (!handler) {
        return nativeFetch(url, options);
      }

      const request = new KakapoRequest({
        params: interceptor.getParams(url, method),
        query: interceptor.getQuery(url),
        body: options.body || "",
        headers: options.headers || {}
      });
      const db = interceptor.getDB();
      const response = handler(request, db);

      if (response instanceof Promise) {
        //TODO: Should we handle 'requestDelay' also for async responses?
        return response.then(data => fakeResponse(data));
      }

      if (!(response instanceof KakapoResponse)) {
        return new Promise(resolve =>
          setTimeout(
            () => resolve(fakeResponse(response)),
            interceptor.getDelay()
          )
        );
      }

      const result = fakeResponse(response.body, response.headers);
      return new Promise((resolve, reject) =>
        setTimeout(() => {
          if (response.error) {
            return reject(result);
          }
          return resolve(result);
        }, interceptor.getDelay())
      );
    };
  }
}

function isFakeFetch(fetch: any): boolean {
  return window.fetch instanceof FakeFetch;
}

const fakeFetch = new FakeFetch();

export const enable = (config: InterceptorConfig) => {
  if (!isFakeFetch(window.fetch)) {
    window.fetch = fakeFetch.fake();
  }

  fakeFetch.use(config);
};

export const disable = () => {
  window.fetch = nativeFetch;
};
