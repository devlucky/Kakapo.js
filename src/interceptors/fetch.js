import pathToRegexp from 'path-to-regexp';
let routes;
const nativeFetch = window.fetch;

export const fakeFetch = (serverRoutes) => {
  routes = serverRoutes;

  return (url, options = {}) => {
    const method = options.method || 'GET';
    const methodRoutes = routes[method];
    let routeHandler;
    let params;

    Object.keys(methodRoutes).forEach((path) => {
      let routeRegex = pathToRegexp(path);

      if (!routeHandler && routeRegex.exec(url)) {
        routeHandler = methodRoutes[path];
        params = routeRegex.exec(url);
      }
    });

    if (routeHandler) {
      return Promise.resolve(routeHandler({params}));
    }

    return nativeFetch(url, options);
  }
};

export const reset = () => {
  window.fetch = nativeFetch;
}