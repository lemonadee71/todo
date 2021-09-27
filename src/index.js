import { render } from 'poor-man-jsx';
import defineCustomElements from './components/custom';
import Router from './components/Router';
import * as pages from './pages';
import App from './core';

const routes = [
  {
    path: '/',
    name: 'Todo List',
    component: pages.Landing,
  },
  {
    path: '/app',
    name: 'Home',
    component: pages.App,
  },
  {
    path: '/login',
    name: 'Login',
    component: pages.Login,
  },
];

const Website = () => Router(routes);

defineCustomElements();
App.event.emit('init');

render(Website(), document.body);
