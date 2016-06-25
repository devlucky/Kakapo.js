import * as xhrInterceptor from './xhrInterceptor';
import * as fetchInterceptor from './fetchInterceptor';

export const interceptors = {
  XMLHttpRequest: xhrInterceptor,
  fetch: fetchInterceptor
};