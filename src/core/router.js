import Navigo from 'navigo';
// import { GH_PATH } from './constants';

const Router = (() => {
  const routes = new Map([['notFound', []]]);
  const navigo = new Navigo('/', { strategy: 'ALL' });

  navigo.notFound((match) => {
    routes.get('notFound').forEach((handler) => handler(match));
  });

  const on = (path, handler, hooks = {}) => {
    if (!routes.get(path)) {
      navigo.on(path, (match) => {
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

      if (hook) navigo[action](path.toString(), hook);
    });
  };

  const register = (arr) => {
    arr.forEach((route) => on(route.path, route.handler, route.hooks));
  };

  const off = (path) => {
    routes.delete(path);
    navigo.off(path);
  };

  const notFound = (handler) => {
    const handlers = routes.get('notFound');
    routes.set('notFound', handler ? [...handlers, handler] : handlers);
  };

  return {
    ...navigo,
    on,
    off,
    notFound,
    register,
  };
})();

export default Router;
