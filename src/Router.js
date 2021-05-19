import Component from './helpers/component';
import event from './modules/event';

const currentLocation = Component.createState(
  window.location.hash.replace('#', '') || 'all'
);

const Router = (routes) => {
  event.on('hashchange', (path) => {
    currentLocation.value = `/${path}`;
  });

  const changeContent = (path) => {
    const route = routes.find((item) => item.path === path);

    if (!route || !route.component) {
      return Component.html`<h1>No component associated with this route</h1>`;
    }

    return route.component.call(null);
  };

  return Component.html`
    <div ${{ $content: currentLocation.bind('value', changeContent) }}>
      ${changeContent(currentLocation.value)}
    </div>
  `;
};

export default Router;
