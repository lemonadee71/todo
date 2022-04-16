import { createHook, html, render } from 'poor-man-jsx';
import Core from '../core';
import { copy } from '../utils/misc';

const Router = ({ routes, tag = 'div', props }) => {
  const containerClass = props?.class || '';
  const [state] = createHook({
    class: containerClass,
    url: window.location.pathname,
    match: null,
    component: [],
  });
  let unsubscribe;

  const handler = (match) => {
    state.match = match;
    state.url = match.url;

    // show loading component
    state.component = props?.loadingComponent?.() || [];

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
      state.class = `${containerClass} ${route?.className || ''}`.trim();
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
            } else {
              // run already hook for consecutive matches
              route.hooks?.already?.(match);
            }

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
      ${copy(props, ['class', 'loadingComponent'])}
      class=${state.$class}
      onCreate=${init}
      onDestroy=${destroy}
      onMount=${() => Core.router.resolve(window.location.pathname)}
    >
      ${state.$component((value) => render(value))}
    </${tag}>
  `;
};

export default Router;
