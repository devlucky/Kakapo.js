import { KakapoResponse } from '../Response';
import { KakapoRequest } from '../Request';
import {
  interceptorHelper,
  Interceptor,
  InterceptorConfig
} from './interceptorHelper';
import { mapRequestInfoToUrlString, canUseWindow } from '../utils';
import { Database, DatabaseSchema } from '../Database';

const fakeResponse = (
  response: string | any = {},
  headers: { [k: string]: string } = {}
) => {
  // If content type exist and is different to application/json no parse the response
  if (
    headers['content-type'] &&
        headers['content-type'].indexOf('application/json') == -1
  ) {
    return new Response(response, { headers });
  }

  // Default handler, If no content type response as json.
  return new Response(JSON.stringify(response), { headers });
};

export class FakeFetchFactory<M extends DatabaseSchema> {
    interceptors: Interceptor<M>[];

    constructor() {
      this.interceptors = [];
    }

    use(config: InterceptorConfig<M>) {
      this.interceptors.push(interceptorHelper(config));
    }

    getFetch(): typeof fetch {
      return (
        requestInfo: RequestInfo,
        options: RequestInit = {}
      ): Promise<Response> => {
        const url = mapRequestInfoToUrlString(requestInfo);
        const method = options.method || 'GET';

        const interceptor = this.interceptors.reduce(
          (result: Interceptor<M> | undefined, interceptor) =>
            interceptor.getHandler(url, method) !== null ? interceptor : result,
          undefined
        );

        if (interceptor) {
          const handler = interceptor.getHandler(url, method);

          if (handler) {
            const request = new KakapoRequest({
              params: interceptor.getParams(url, method),
              query: interceptor.getQuery(url),
              body: options.body || '',
              headers: options.headers || {}
            });
            const db = interceptor.getDB() || new Database<M>();
            const response = handler(request, db);

            if (response instanceof Promise) {
              //TODO: Should we handle 'requestDelay' also for async responses?
              return response.then(data => {
                if (data instanceof KakapoResponse) {
                  return fakeResponse(data.body, data.headers);
                }
                return fakeResponse(data)
              });
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
          } else {
            return nativeFetch(url, options);
          }
        } else {
          return nativeFetch(url, options);
        }
      };
    }
}

let nativeFetch: typeof fetch;

export function isFakeFetch<M extends DatabaseSchema>(fetch: any): fetch is FakeFetchFactory<M> {
  return window.fetch !== nativeFetch;
}

const fakeFetchFactory = new FakeFetchFactory();

export const enable = <M extends DatabaseSchema>(config: InterceptorConfig<M>) => {
  if (!canUseWindow) {
    throw new Error(`You're trying to use fetch interceptor in non-browser environment`);
  }
  if (!nativeFetch) {
    nativeFetch = window.fetch
  }

  if (!isFakeFetch<M>(window.fetch)) {
    window.fetch = fakeFetchFactory.getFetch();
  }
  fakeFetchFactory.use(config);
};

export const disable = () => {
  window.fetch = nativeFetch;
};
