import autosize from 'autosize';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import PoorManJSX, { addHooks } from 'poor-man-jsx';
import { PROJECT } from './actions';
import { LAST_OPENED_PAGE, PATHS } from './constants';
import Core from './core';
import { LocalStorage } from './core/storage';
import { fetchProjects, initFirestore, setupListeners } from './core/firestore';
import { isGuest, isNewUser, signIn } from './utils/auth';
import { createDropdown } from './utils/dropdown';
import { getUserRef, updateUser } from './utils/firestore';
import { makeKeyboardSortable } from './utils/sortable';
import { initializeTheme } from './utils/theme';
import { addSchema, applyValidation } from './utils/validate';
import defineCustomElements from './components/custom';
import Router from './components/Router';
import * as pages from './pages';
import { config as firebaseConfig } from './firebase-config';
import './styles/style.css';
import 'wicg-inert';

addSchema('title', {
  rows: 1,
  required: true,
  'data-autosize': '',
});

PoorManJSX.addBooleanAttribute('data-selected');

PoorManJSX.onAfterCreation((element) => {
  if (element.matches('[data-validate]')) {
    applyValidation(element);
  }

  if (element.matches('[data-autosize]')) {
    element.addEventListener('@mount', () => autosize(element));
  }

  // for dropdowns we assume that the button is next to its dropdown menu
  if (element.matches('[data-dropdown]')) {
    createDropdown(element, element.nextElementSibling);
  }

  if (element.matches('[data-sortable]')) {
    makeKeyboardSortable(element);
  }
});

const routes = [
  {
    path: PATHS.home.url,
    component: pages.Landing,
  },
  {
    path: PATHS.login.url,
    component: pages.Login,
  },
  {
    path: PATHS.app.url,
    component: pages.App,
    className:
      'font-sans text-black h-screen bg-white md:ml-56 dark:text-white dark:bg-[#353535]',
    nested: true,
    beforeRender: async () => {
      // call here since only app/* page is themed
      await initializeTheme();

      // setup core listeners
      Core.setupListeners();
      // setup local storage
      LocalStorage.prefix = `${Core.state.currentUser}__`;

      if (isGuest()) {
        Core.main.initLocal();
        Core.data.root.add(Core.main.getAllProjects());

        // to make local work with useSelectLocation
        Core.data.fetched.projects.push(...Core.data.root.ids);
      } else {
        // populate firestore first if new user
        if (await isNewUser(Core.state.currentUser)) await initFirestore();

        // then fetch all projects
        const projects = await fetchProjects();
        Core.data.root.add(projects);
        Core.main.init(projects);

        // setup firestore listeners
        setupListeners();
      }
    },
    hooks: {
      already: async (match) => {
        const data = {
          title: document.title,
          url: match.url,
        };

        const [, , id] = match.url.split('/');
        if (id) {
          Core.event.emit(PROJECT.UPDATE, {
            project: id,
            data: { lastOpened: Date.now() },
          });
        }

        if (isGuest()) {
          LocalStorage.store(LAST_OPENED_PAGE, data);
        } else {
          await updateUser(Core.state.currentUser, {
            [LAST_OPENED_PAGE]: data,
          });
        }
      },
      after: async () => {
        let cached;
        if (isGuest()) {
          cached = LocalStorage.get(LAST_OPENED_PAGE);
        } else {
          const document = await getUserRef(Core.state.currentUser);
          cached = document.data()?.[LAST_OPENED_PAGE];
        }

        // do not redirect if same page
        if (cached && cached.url !== PATHS.dashboard.url) {
          Core.router.navigate(cached.url, {
            title: cached?.title,
            replace: true,
          });
        }
      },
    },
  },
];

initializeApp(firebaseConfig);
defineCustomElements();
// allow toggling of theme
addHooks(document.documentElement, {
  class: Core.state.$darkTheme((value) => (value ? 'dark' : 'light')),
});
// make body our main router
Router({ routes, target: document.body });
Core.router.resolve('/');

onAuthStateChanged(getAuth(), (user) => {
  // sign in user if did not logged out
  if (user) signIn(user.uid);
});
