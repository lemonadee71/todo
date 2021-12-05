import Navigo from 'navigo';
// import { GH_PATH } from './constants';

const Router = (() => {
  const routes = new Map();
  const navigo = new Navigo('/', { strategy: 'ALL' });

  const _getHandlers = (path) => Array.from(routes.get(path).keys());

  const on = (path, handler, hooks = {}) => {
    if (!routes.get(path)) {
      // init path
      navigo.on(path, (match) => {
        _getHandlers(path).forEach((cb) => cb(match));
      });
    }

    // add handler
    const handlers = routes.get(path) || new Map();
    routes.set(path, handler ? handlers.set(handler) : handlers);

    // add hooks
    Object.entries(hooks).forEach(([key, hook]) => {
      const type = key[0].toUpperCase() + key.slice(1).toLowerCase();
      const action = `add${type}Hook`;

      if (hook) navigo[action](path.toString(), hook);
    });
  };

  const register = (arr) => {
    arr.forEach((route) => on(route.path, route.handler, route.hooks));
  };

  const off = (path, handler) => {
    const handlers = routes.get(path);
    handlers.delete(handler);
    routes.set(path, handlers);
  };

  const remove = (path) => {
    routes.delete(path);
    navigo.off(path);
  };

  return {
    ...navigo,
    on,
    off,
    remove,
    register,
  };
})();

export default Router;
