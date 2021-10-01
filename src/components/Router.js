import { createHook, html } from 'poor-man-jsx';
import Core from '../core';
// import createRouter from '../utils/createRouter';

const Router = (routes, initialMatch = null, tagName = 'div', classes = '') => {
  const [current] = createHook({
    url: initialMatch?.url,
    match: initialMatch,
  });

  const handler = (match) => {
    current.match = match;
    current.url = match.url;
  };

  const init = () => {
    routes.forEach((route) => {
      Core.router.on(route.path, handler);
    });
  };

  const destroy = () => {
    routes.forEach((route) => {
      Core.router.off(route.path, handler);
    });
  };

  const changeContent = (url) =>
    routes
      .find((route) => Core.router.matchLocation(route.path, url))
      ?.component(current.match);

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
