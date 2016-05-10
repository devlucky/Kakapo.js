import * as xhrInterceptor from './xhrInterceptor';
import * as fetchInterceptor from './fetchInterceptor';

const interceptor = ({ name, reference, fakeService }) => ({
  enable(config) {
    window[name] = fakeService(config);
  },
  disable() {
    window[name] = reference;
  },
});

export const interceptors = {
  XMLHttpRequest: interceptor(xhrInterceptor),
  fetch: interceptor(fetchInterceptor),
};
