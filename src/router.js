const defaultConfig = {
  strategies: ['fetch', 'XMLHttpRequest']
};
const nativeFetch = window.fetch;

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

  //TODO: Use config
  intercept(strategies) {
    if (strategies.indexOf('fetch') > -1) {
      window.fetch = this.fakeFetch.bind(this);
    }
  }

  fakeFetch(url, options = {}) {
    const method = options.method || 'GET';
    const routes = this.routes[method];
    let matchesAnyRoute = false;

    Object.keys(routes).forEach((route) => {
      debugger
    });
    //TODO: If doesn't match any of the registered routes, just use 'nativeFetch'

    if (!matchesAnyRoute) {
      return nativeFetch(url, options);
    }
  }
}