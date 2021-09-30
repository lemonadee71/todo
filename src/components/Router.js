import { createHook, html } from 'poor-man-jsx';
import Core from '../core';
// import createRouter from '../utils/createRouter';

const Router = (routes, error, tagName = 'div', classes = '') => {
  const [current, revoke] = createHook({
    route: window.location.pathname,
    match: null,
    component: null,
  });

  const init = () => {
    routes.forEach((route) => {
      Core.router.on(route.path, (match) => {
        current.match = match;
        current.route = match.url;
      });
    });
  };

  const changeContent = (path) =>
    routes
      .find((route) => Core.router.matchLocation(route.path, path))
      .component(current.match);

  return html`
    <${tagName}
      class="${Array.isArray(classes) ? classes.join(' ') : classes}"
      ${{
        $children: current.$route(changeContent),
        '@mount': init,
        '@destroy': revoke,
      }}
    ></${tagName}>
  `;
};

export default Router;
