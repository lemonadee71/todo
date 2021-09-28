import Navigo from 'navigo';
// import { GH_PATH } from './constants';

const Router = (() => {
  const routes = new Map();
  const self = new Navigo('/', { strategy: 'ALL' });

  const on = (path, handler, hooks = {}) => {
    if (!routes.get(path)) {
      self.on(path, (match) => {
        routes.get(path).forEach((cb) => cb(match));
      });
    }

    // add handler
    const handlers = routes.get(path) || [];
    routes.set(path, handler ? [...handlers, handler] : handlers);

    // add hooks
    Object.entries(hooks).forEach(([key, hook]) => {
      const type = key[0].toUpperCase() + key.slice(1).toLowerCase();
      const action = `add${type}Hook`;
      const pathString = path instanceof RegExp ? path.toString() : path;

      if (hook) self[action](pathString, hook);
    });
  };

  const register = (arr) => {
    arr.forEach((route) => on(route.path, route.handler, route.hooks));
  };

  const off = (path) => {
    routes.delete(path);
    self.off(path);
  };

  return {
    ...self,
    on,
    off,
    register,
  };
})();

export default Router;
