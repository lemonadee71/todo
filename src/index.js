import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { html, render } from 'poor-man-jsx';
import { PATHS } from './core/constants';
import { signIn } from './utils/auth';
import defineCustomElements from './components/custom';
import Router from './components/Router';
import * as pages from './pages';
import { config as firebaseConfig } from './firebase-config';
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

initializeApp(firebaseConfig);
defineCustomElements();
render(Website, document.body);

onAuthStateChanged(getAuth(), (user) => {
  // sign in if user did not logged out
  if (user) signIn(user.uid);
});
