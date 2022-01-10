import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { html, render } from 'poor-man-jsx';
import Core from './core';
import { PATHS } from './core/constants';
import { setupListeners } from './core/firestore';
import { isGuest, signIn } from './utils/auth';
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
    resolver: (component, match) => {
      // setup core listeners
      Core.setupListeners();
      // initialize data
      Core.init();

      if (isGuest()) {
        Core.state.root.add(Core.main.getLocalData());
        Core.main.initLocal();
      } else {
        // setup firestore listeners
        setupListeners();
      }

      return component(match);
    },
  },
];

const Website = html`${Router({ routes, tag: 'main', props: { id: 'main' } })}`;

initializeApp(firebaseConfig);
defineCustomElements();
render(Website, document.body);

onAuthStateChanged(getAuth(), async (user) => {
  // sign in user if did not logged
  if (user) await signIn(user.uid);
});
