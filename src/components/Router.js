import { createHook, html } from 'poor-man-jsx';
import Core from '../core';
// import createRouter from '../utils/createRouter';

const Router = (routes, error = () => null, tagName = 'div', classes = '') => {
  const [current] = createHook({
    url: window.location.pathname,
    match: null,
  });

  const handler = (match) => {
    current.match = match;
    current.url = match.url;
  };

  const init = () => {
    routes.forEach((route) => {
      Core.router.on(route.path, handler);
    });

    Core.router.notFound(handler);
  };

  const destroy = () => {
    routes.forEach((route) => {
      Core.router.off(route.path, handler);
    });
  };

  const changeContent = (url) => {
    const route = routes.find((r) => Core.router.matchLocation(r.path, url));

    if (route) return route.component(current.match);
    return error(current.match);
  };

  return html`
    <${tagName}
      class="${Array.isArray(classes) ? classes.join(' ') : classes}"
      ${{
        $children: current.$url(changeContent),
        '@create': init,
        '@destroy': destroy,
      }}
    ></${tagName}>
  `;
};

export default Router;
