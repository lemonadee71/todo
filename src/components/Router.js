import { createHook, html } from 'poor-man-jsx';
import Core from '../core';
import Loading from './Loading';

const Router = ({ routes, tag = 'div', props }) => {
  const [state] = createHook({
    url: window.location.pathname,
    match: null,
    component: [],
  });
  let unsubscribe;

  const handler = (match) => {
    state.match = match;
    state.url = match.url;

    // show loading component
    state.component = Loading();

    // then show the actual component
    (async () => {
      const route = routes.find((r) =>
        Core.router.matchLocation(r.path, state.url)
      );

      const dummy = (c, m) => c?.(m);
      const resolver = route?.resolver || dummy;
      state.component = route?.component
        ? await resolver(route.component, state.match)
        : [];
    })();
  };

  const init = () => {
    unsubscribe = routes.map((route) => {
      if (route.nested) {
        return Core.router.on(route.path, null, {
          leave: route.hooks?.leave,
          before: (done, match) => {
            // only run handler for nested routes on first match
            if (!Core.router.matchLocation(route.path, state.url)) {
              handler(match);

              // after hook is run after our own handler
              route.hooks?.after?.(match);
            }

            // run already hook for consecutive matches
            route.hooks?.already?.(match);

            if (route.hooks?.before) route.hooks.before(done, match);
            else done();
          },
        });
      }

      return Core.router.on(route.path, handler, route.hooks);
    });
  };

  const destroy = () => unsubscribe.forEach((cb) => cb());

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
