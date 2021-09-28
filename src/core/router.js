import Navigo from 'navigo';
// import { GH_PATH } from './constants';

const Router = (() => {
  const routes = new Map();
  const self = new Navigo('/');

  const on = (path, handler, hooks = {}) => {
    if (!routes.get(path)) {
      self.on(path, (match) => {
        routes.get(path).forEach((cb) => cb(match));
      });
    }

    // add handler
    const handlers = routes.get(path) || [];
    routes.set(path, [...handlers, handler]);

    // add hooks
    Object.entries(hooks).forEach(([key, hook]) => {
      const type = key[0].toUpperCase() + key.slice(1).toLowerCase();
      const action = `add${type}Hook`;

      self[action](path, hook);
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
