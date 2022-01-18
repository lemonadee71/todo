import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { html, render } from 'poor-man-jsx';
import Core from './core';
import { LocalStorage } from './core/storage';
import { LAST_OPENED_PAGE, PATHS } from './core/constants';
import { initFirestore, setupListeners } from './core/firestore';
import { isGuest, isNewUser, signIn } from './utils/auth';
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
    resolver: async (component, match) => {
      // setup core listeners
      Core.setupListeners();
      // setup local storage
      LocalStorage.prefix = `${Core.state.currentUser}__`;

      if (isGuest()) {
        Core.data.root.add(Core.main.getLocalData());
        Core.main.initLocal();
      } else {
        // populate firestore first if first time user
        if (await isNewUser(Core.state.currentUser)) await initFirestore();
        // setup firestore listeners
        setupListeners();
      }

      return component(match);
    },
    hooks: {
      already: (match) => {
        LocalStorage.store(LAST_OPENED_PAGE, {
          title: document.title,
          url: match.url,
        });
      },
      after: () => {
        const cached = LocalStorage.get(LAST_OPENED_PAGE);

        Core.router.navigate(cached?.url || '/app', {
          title: cached?.title,
          replace: true,
        });
      },
    },
  },
];

const Website = html`${Router({ routes, tag: 'main', props: { id: 'main' } })}`;

initializeApp(firebaseConfig);
defineCustomElements();
render(Website, document.body);

onAuthStateChanged(getAuth(), (user) => {
  // sign in user if did not logged out
  if (user) signIn(user.uid);
});
