import pathToRegexp from 'path-to-regexp';
let routes;
const nativeFetch = window.fetch;

const queryFrom = (url = '') => {
  return url.split('&').reduce((prev, current) => {
    let [key, value] = current.split('=');
    if (key) prev[key] = value;

    return prev;
  }, {});
};

export const fakeFetch = (serverRoutes) => {
  routes = serverRoutes;

  return (url, options = {}) => {
    const chunks = url.split('?');
    const method = options.method || 'GET';
    const methodRoutes = routes[method];
    let routeHandler;
    let params;
    let query = chunks[1];
    url = chunks[0];

    Object.keys(methodRoutes).forEach((path) => {
      let placeholders = [];
      let routeRegex = pathToRegexp(path, placeholders);
      
      if (!routeHandler && routeRegex.exec(url)) {
        routeHandler = methodRoutes[path];
        params = routeRegex.exec(url);
        query = queryFrom(query);

        if (placeholders.length) {
          params.shift();
          params = params.reduce((prev, current, i) => {
            prev[placeholders[i].name] = current;
            return prev;
          }, {});
        }
      }
    });

    if (routeHandler) {
      const body = options.body;
      //TODO: Wrap 'resolve' result into a Response instance, check https://github.com/devlucky/Kakapo.js/issues/16
      return Promise.resolve(routeHandler({params, query, body}));
    }

    return nativeFetch(url, options);
  }
};

export const reset = () => {
  window.fetch = nativeFetch;
}