import { addHooks, createHook, html, render } from 'poor-man-jsx';
import Core from '../core';
import { copy } from '../utils/misc';
import Loading from './Loading';

const Router = ({ routes, tag = 'div', target, props, loadingComponent }) => {
  const containerClass = props?.class || '';
  const [state] = createHook({
    class: '',
    url: window.location.pathname,
    match: null,
    component: [],
  });

  const handler = (match) => {
    state.match = match;
    state.url = match.url;

    // show loading component
    state.component = loadingComponent?.() ?? Loading();

    (async () => {
      const route = routes.find((r) =>
        Core.router.matchLocation(r.path, state.url)
      );

      // run preliminary stuff
      await route.beforeRender?.(state.match);

      // then show component
      state.component = route.component(state.match) ?? [];
      state.class = route.className || '';
    })();
  };

  // register routes
  const cleanup = routes.map((route) => {
    if (route.nested) {
      return Core.router.on(route.path, null, {
        leave: route.hooks?.leave,
        before: (done, match) => {
          let shouldStopExecution;

          // to respect the behavior of navigo when passing false to done
          const mockDone = (bool) => {
            shouldStopExecution = bool === false;
            done(bool);
          };

          if (route.hooks?.before) route.hooks.before(mockDone, match);
          else done();

          if (!shouldStopExecution) {
            // only run handler for nested routes on first match
            if (!Core.router.matchLocation(route.path, state.url)) {
              handler(match);

              // after hook is run after our own handler
              route.hooks?.after?.(match);
            } else {
              // run already hook for consecutive matches
              route.hooks?.already?.(match);
            }
          }
        },
      });
    }

    return Core.router.on(route.path, handler, route.hooks);
  });

  const destroy = () => cleanup.forEach((cb) => cb());

  // resolve path internally
  // we can do this once on first render
  // but nested routes will show undefined on mount
  // so do this for every creation instead
  Core.router.resolve(window.location.pathname);

  // props are not inherited if target is used
  if (target && target instanceof HTMLElement) {
    target.addEventListener('@destroy', destroy);
    addHooks(target, {
      class: state.$class((value) => `${containerClass} ${value}`.trim()),
      children: state.$component((value) => render(value)),
    });

    // just return the target
    return target;
  }

  return html`
    <${tag}
      ${copy(props, ['class'])}
      class="${containerClass} ${state.$class}"
      onDestroy=${destroy}
    >
      ${state.$component((value) => render(value))}
    </${tag}>
  `;
};

export default Router;
