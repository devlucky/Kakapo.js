import { KakapoResponse } from '../Response';
import { KakapoRequest } from '../Request';
import {
    interceptorHelper,
    Interceptor,
    InterceptorConfig
} from './interceptorHelper';
import { mapRequestInfoToUrlString, canUseWindow } from '../utils';

if (!canUseWindow) {
    throw new Error(`You're trying to use fetch intercepter in non-browser environment`);
}

const nativeFetch: typeof fetch = window.fetch;
const fakeResponse = (
    response: string | any = {},
    headers: { [k: string]: string } = {}
) => {
    // If content type exist and is different to application/json no parse the response
    if (
        headers['content-type'] &&
    headers['content-type'].indexOf('application/json') == -1
    ) {
        console.log(response);

        return new Response(response, { headers });
    }

    // Default handler, If no content type response as json.
    return new Response(JSON.stringify(response), { headers });
};

export class FakeFetch {
    interceptors: Interceptor[];

    constructor() {
        this.interceptors = [];
    }

    use(config: InterceptorConfig) {
        this.interceptors.push(interceptorHelper(config));
    }

    fake(): typeof fetch {
        return (
            requestInfo: RequestInfo,
            options: RequestInit = {}
        ): Promise<Response> => {
            const url = mapRequestInfoToUrlString(requestInfo);
            const method = options.method || 'GET';

            const interceptor = this.interceptors.reduce(
                (result: Interceptor | undefined, interceptor) =>
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
                } else {
                    return nativeFetch(url, options);
                }
            } else {
                return nativeFetch(url, options);
            }
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
