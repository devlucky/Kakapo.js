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
      const body = options.body;
      //TODO: Wrap resolve result into a Response instance, check https://github.com/devlucky/Kakapo.js/issues/16
      return Promise.resolve(routeHandler({params, body}));
    }

    return nativeFetch(url, options);
  }
};

export const reset = () => {
  window.fetch = nativeFetch;
}