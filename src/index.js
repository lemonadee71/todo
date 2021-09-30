import { html, render } from 'poor-man-jsx';
import { PATHS } from './core/constants';
import defineCustomElements from './components/custom';
import Router from './components/Router';
import * as pages from './pages';

const routes = [
  {
    path: PATHS.home,
    name: 'Todo List',
    component: pages.Landing,
  },
  {
    path: PATHS.app,
    name: 'Home',
    component: pages.App,
  },
  {
    path: PATHS.login,
    name: 'Login',
    component: pages.Login,
  },
];
const Website = () =>
  html`
    <ul>
      <li><a is="navigo-link" href="/">Home</a></li>
      <li><a is="navigo-link" href="/app">App</a></li>
      <li><a is="navigo-link" href="/login">Login</a></li>
      <li><a is="navigo-link" href="/error">Nowhere</a></li>
    </ul>
    ${Router(routes, pages.Error, 'main')}
  `;

defineCustomElements();
render(Website(), document.body);
