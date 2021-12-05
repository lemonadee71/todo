import { html, render } from 'poor-man-jsx';
import { PATHS } from './core/constants';
import defineCustomElements from './components/custom';
import Router from './components/Router';
import * as pages from './pages';
import './styles/main.scss';

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
    path: '/app*',
    component: pages.App,
    nested: true,
  },
];

const Website = html`${Router({ routes, tag: 'main', props: { id: 'main' } })}`;

defineCustomElements();
render(Website, document.body);
