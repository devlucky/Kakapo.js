import * as xmlHttpRequest from './xmlhttprequest';
import * as fetch from './fetch';

const interceptor = ({name, reference, fakeService}) => ({
  assign(routes) {
    window[name] = fakeService(routes);
  },
  reset() {
    window[name] = reference;
  }
});

export const interceptors = {
  'XMLHttpRequest': interceptor(xmlHttpRequest),
  'fetch': interceptor(fetch)
};
