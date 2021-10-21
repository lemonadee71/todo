import { html, render } from 'poor-man-jsx';
import { PATHS } from './core/constants';
import defineCustomElements from './components/custom';
import Router from './components/Router';
import * as pages from './pages';
import Sidebar from './components/Sidebar';
import Core from './core';
import 'github-markdown-css';
import 'toastify-js/src/toastify.css';
import './styles/main.scss';

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
    ${Router([{ path: '*', component: renderSidebar }], 'aside', {
      class: 'sidebar',
    })}
    ${Router(routes, 'main', { class: 'app' })}
    <my-modal id="main-modal" close-btn-class="modal__close-btn"></my-modal>
  `;

defineCustomElements();
render(Website(), document.body);
Core.router.navigate('/app'); // for testing purposes
