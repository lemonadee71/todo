import { html, createHook } from 'poor-man-jsx';
import { getParams, getParamValues } from './params';
import App from '../core';

const defaultError = (path) =>
  html`<h2>No component is associated with ${path}</h2>`;

// Will only render one component at a time
const createRouter =
  (isHash = false) =>
  (routes, error = defaultError, className = '', tagName = 'div') => {
    const [current, revoke] = createHook({
      path: '',
      isExact: true,
      component: [],
    });

    const _routes = routes.map((route) => {
      const [pattern, params] = getParams(route.path, route.exact);
      return { ...route, path: pattern, params };
    });

    const changeContent = (path, state) => {
      if (
        (!current.isExact && path.startsWith(current.path)) ||
        current.path === path
      )
        return;

      const route = _routes.find((r) => r.path.exec(path));

      if (route && route.component) {
        const payload = {
          path,
          state,
        };

        if (route.params.length) {
          payload.params = getParamValues(path, route.path, route.params);
        }

        if (route.title) {
          document.title = route.title;
        }

        current.component = route.component.call(null, payload);
      } else {
        current.component = error.call(null, path);
      }

      current.isExact = route?.exact ?? true;
      current.path = path;
    };

    return html`
    <${tagName} ${className && `class="${className}"`} 
    ${{
      '@mount': () =>
        changeContent(
          isHash ? App.history.getHash() : App.history.getPath(),
          window.history.state
        ),
      '@create': () =>
        App.history[isHash ? 'onHashChange' : 'onPopState'](changeContent),
      '@destroy': () => {
        revoke();
        App.history.off(changeContent);
      },
      $children: current.$component,
    }}>
    </${tagName}>
  `;
  };

export default createRouter;
