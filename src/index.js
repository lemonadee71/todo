import { html, render } from 'poor-man-jsx';
import { PATHS } from './core/constants';
import defineCustomElements from './components/custom';
import Router from './components/Router';
import * as pages from './pages';
import Sidebar from './components/Sidebar';
import Core from './core';

Core.router.on(PATHS.allApp, null, {
  before: (done, match) => {
    const newURL = match.url;
    const isNavigatingToApp =
      !Core.router.matchLocation(PATHS.allApp) && newURL.startsWith(PATHS.app);

    if (isNavigatingToApp) Core.init();

    // This causes unnecessary renders for app
    // by always rerendering even if still on the same path
    done();
  },
});

const routes = [
  {
    path: PATHS.home,
    component: pages.Landing,
  },
  {
    path: PATHS.login,
    component: pages.Login,
  },
  {
    path: PATHS.app,
    component: pages.Overview,
  },
  {
    path: PATHS.calendar,
    component: pages.Calendar,
  },
  {
    path: PATHS.project,
    component: pages.Project,
  },
];

const renderSidebar = (match) => {
  if (Core.router.matchLocation('/app*', match?.url)) return Sidebar();
  return [];
};

const Website = () =>
  html`
    <ul>
      <li><a is="navigo-link" href="/" title="To Do List">Home</a></li>
      <li><a is="navigo-link" href="/app" title="Overview">App</a></li>
      <li><a is="navigo-link" href="/login" title="Login">Login</a></li>
    </ul>
    ${Router([{ path: '*', component: renderSidebar }], () => [], 'aside')}
    ${Router(routes, pages.Error, 'main')}
  `;

defineCustomElements();
render(Website(), document.body);
