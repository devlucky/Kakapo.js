import * as xhrInterceptor from './xhrInterceptor';
import * as fetchInterceptor from './fetchInterceptor';

export interface Interceptors {
    XMLHttpRequest: typeof xhrInterceptor;
    fetch: typeof fetchInterceptor;
}
export const interceptors: Interceptors = {
  XMLHttpRequest: xhrInterceptor,
  fetch: fetchInterceptor
};