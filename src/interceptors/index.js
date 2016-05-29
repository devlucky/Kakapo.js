import * as xhrInterceptor from './xhrInterceptor';
import * as fetchInterceptor from './fetchInterceptor';
import { interceptorHelper } from './interceptorHelper';

const interceptor = ({ name, reference, fakeService }) => ({
  enable(config) {
    window[name] = fakeService(interceptorHelper(config));
  },
  disable() {
    window[name] = reference;
  },
});

export const interceptors = {
  XMLHttpRequest: interceptor(xhrInterceptor),
  fetch: interceptor(fetchInterceptor),
};
