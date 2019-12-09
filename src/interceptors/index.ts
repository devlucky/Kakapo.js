import * as xhrInterceptor from './xhrInterceptor';
import * as fetchInterceptor from './fetchInterceptor';

export interface Interceptors {
  XMLHttpRequest: typeof xhrInterceptor;
  fetch: typeof fetchInterceptor;
  http?: any;
  https?: any;
}

export const interceptors: Interceptors = {
  XMLHttpRequest: xhrInterceptor,
  fetch: fetchInterceptor
};
