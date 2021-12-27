import { createHook, html } from 'poor-man-jsx';
import Core from '../core';
import Loading from './Loading';

const Router = ({ routes, tag = 'div', props }) => {
  const [state] = createHook({
    url: window.location.pathname,
    match: null,
    component: [],
  });

  const handler = (match) => {
    state.match = match;
    state.url = match.url;

    // show loading component
    state.component = Loading();

    const route = routes.find((r) =>
      Core.router.matchLocation(r.path, state.url)
    );

    // then show the actual component
    (async () => {
      const dummy = (c, m) => c?.(m);
      const resolver = route?.resolver || dummy;
      state.component = route?.component
        ? await resolver(route.component, state.match)
        : [];
    })();
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

  return html`
    <${tag}
      ${props}
      ${{
        onCreate: init,
        onDestroy: destroy,
        onMount: () => Core.router.resolve(window.location.pathname),
        $children: state.$component,
      }}
    ></${tag}>
  `;
};

export default Router;
