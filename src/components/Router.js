import { createHook, html } from 'poor-man-jsx';
import Core from '../core';

const Router = ({ routes, tag = 'div', props }) => {
  const [state] = createHook({
    url: window.location.pathname,
    match: null,
  });

  const handler = (match) => {
    state.match = match;
    state.url = match.url;
  };

  const init = () => {
    routes.forEach((route) => {
      if (route.nested) {
        Core.router.on(route.path, null, {
          before: (done, match) => {
            // only run handler for nested routes on first match
            if (!Core.router.matchLocation(route.path, state.url)) {
              handler(match);
            }

            done();
          },
        });
      } else {
        Core.router.on(route.path, handler);
      }
    });
  };

  const destroy = () => {
    routes.forEach((route) => {
      Core.router.off(route.path, handler);
    });
  };

  const changeContent = (url) => {
    const route = routes.find((r) => Core.router.matchLocation(r.path, url));

    return route?.component?.(state.match) || [];
  };

  return html`
    <${tag}
      ${props}
      ${{
        onCreate: init,
        onDestroy: destroy,
        $children: state.$url(changeContent),
      }}
    ></${tag}>
  `;
};

export default Router;
