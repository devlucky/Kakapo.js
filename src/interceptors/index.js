import * as xmlHttpRequest from './xmlhttprequest';
import * as fetch from './fetch';

const interceptor = ({name, reference, fakeService}) => ({
  enable(routes, host) {
    window[name] = fakeService(routes, host);
  },
  disable() {
    window[name] = reference;
  }
});

export const interceptors = {
  'XMLHttpRequest': interceptor(xmlHttpRequest),
  'fetch': interceptor(fetch)
};
