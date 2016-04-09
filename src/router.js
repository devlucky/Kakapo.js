import pathToRegexp from 'path-to-regexp';

const defaultConfig = {strategies: ['fetch', 'XMLHttpRequest']};
const nativeFetch = window.fetch;
const nativeXMLHttpRequest = window.XMLHttpRequest;

export class Router {
  //TODO: Support 'config.host'
  constructor(config) {
    this.config = Object.assign(defaultConfig, config);
    this.routes = {GET: {}, POST: {}, PUT: {}, DELETE: {}};
    this.intercept(this.config.strategies);
  }

  get(...args) {
    this.register(...['GET', ...args]);
  }

  post(...args) {
    this.register(...['POST', ...args]);
  }

  put(...args) {
    this.register(...['PUT', ...args]);
  }

  delete(...args) {
    this.register(...['DELETE', ...args]);
  }

  register(method, path, handler) {
    this.routes[method][path] = handler;
  }

  intercept(strategies) {
    if (strategies.indexOf('fetch') > -1) {
      window.fetch = this.fakeFetch.bind(this);
    }

    if (strategies.indexOf('XMLHttpRequest') > -1) {
      window.XMLHttpRequest = this.fakeXMLHttpRequest.bind(this);
    }
  }

  fakeFetch(url, options = {}) {
    const method = options.method || 'GET';
    const routes = this.routes[method];
    let routeHandler;
    let params;

    Object.keys(routes).forEach((path) => {
      let routeRegex = pathToRegexp(path);

      if (!routeHandler && routeRegex.exec(url)) {
        routeHandler = routes[path];
        params = routeRegex.exec(url);
      }
    });

    if (routeHandler) {
      return Promise.resolve(routeHandler({params}));
    }

    return nativeFetch(url, options);
  }

  fakeXMLHttpRequest() {

  }
}