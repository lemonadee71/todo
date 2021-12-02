import { initializeApp } from 'firebase/app';
import { html, render } from 'poor-man-jsx';
import { PATHS } from './core/constants';
import defineCustomElements from './components/custom';
import Router from './components/Router';
import * as pages from './pages';
import './styles/main.scss';
import { config as firebaseConfig } from './firebase-config';

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

initializeApp(firebaseConfig);
defineCustomElements();
render(Website, document.body);
