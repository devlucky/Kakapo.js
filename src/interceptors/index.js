import * as xhrInterceptor from './xhrInterceptor';
import * as fetchInterceptor from './fetchInterceptor';
import * as httpInterceptor from './http-Interceptor';
import * as httpsInterceptor from './https-interceptor';

export const interceptors = {
  XMLHttpRequest: xhrInterceptor,
  fetch: fetchInterceptor,
  http: httpInterceptor,
  https: httpsInterceptor
};