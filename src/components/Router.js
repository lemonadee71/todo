import { createHook, html } from 'poor-man-jsx';
import App from '../core';
// import createRouter from '../utils/createRouter';

const Router = (routes, tagName = 'div', classes = '') => {
  const [current, revoke] = createHook({ route: '/', match: null });

  routes.forEach((route) => {
    App.router.on(route.path, (match) => {
      current.match = match;
      current.route = match.url;
    });
  });

  const changeContent = () =>
    routes.find((route) => App.router.matchLocation(route.path))(current.match);

  return html`
    <${tagName}
      class="${Array.isArray(classes) ? classes.join(' ') : classes}"
      ${{ $children: current.$route(changeContent) }}
      ${{ '@destroy:': revoke }}
    ></${tagName}>
  `;
};

export default Router;
