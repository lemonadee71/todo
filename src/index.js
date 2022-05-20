import autosize from 'autosize';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import PoorManJSX, { html, render } from 'poor-man-jsx';
import { HIDE_EVENTS, LAST_OPENED_PAGE, PATHS, SHOW_EVENTS } from './constants';
import Core from './core';
import { LocalStorage } from './core/storage';
import { fetchProjects, initFirestore, setupListeners } from './core/firestore';
import { isGuest, isNewUser, signIn } from './utils/auth';
import { createDropdown } from './utils/dropdown';
import { getUserRef, updateUser } from './utils/firestore';
import { $, $$ } from './utils/query';
import { initializeTheme } from './utils/theme';
import { useTooltip } from './utils/useTooltip';
import defineCustomElements from './components/custom';
import Router from './components/Router';
import * as pages from './pages';
import { config as firebaseConfig } from './firebase-config';
import './styles/style.css';

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
    className:
      'font-sans text-black sm:ml-56 pl-6 pr-2 pt-3 py-2 h-screen dark:text-white dark:bg-[#353535]',
    nested: true,
    beforeRender: async () => {
      // setup core listeners
      Core.setupListeners();
      // setup local storage
      LocalStorage.prefix = `${Core.state.currentUser}__`;

      if (isGuest()) {
        Core.data.root.add(Core.main.getLocalData());
        Core.main.initLocal();

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

        Core.router.navigate(cached?.url || '/app', {
          title: cached?.title,
          replace: true,
        });
      },
    },
  },
];

const Website = html`
  <!-- The main content -->
  ${Router({ routes, tag: 'main', props: { id: 'main' } })}
  <!-- Only one tooltip element for all -->
  <div id="tooltip" role="tooltip">
    <span id="tooltip_text"></span>
    <div id="tooltip_arrow" data-popper-arrow></div>
  </div>
`;

PoorManJSX.onAfterCreation((element) => {
  // add tooltips to elements with data-show-tooltip attr
  $$.data('tooltip', null, element).forEach((item) => {
    const [onShow, onHide] = useTooltip(item);

    SHOW_EVENTS.forEach((name) => item.addEventListener(name, onShow()));
    HIDE_EVENTS.forEach((name) => item.addEventListener(name, onHide()));
  });

  $$.data('autosize', null, element).forEach((item) => {
    autosize(item);
    // to get the correct size on render
    item.addEventListener('@mount', () => autosize.update(item));
  });

  $$.data('dropdown', null, element).forEach((item) => {
    if (item.dataset.dropdownInitialized) return;

    item.addEventListener('@mount', () => {
      createDropdown(
        item,
        $.data('dropdown-id', item.dataset.dropdown, element)
      );

      // to prevent from being initialized again
      item.dataset.dropdownInitialized = 'true';
    });
  });
});

initializeApp(firebaseConfig);
defineCustomElements();
initializeTheme();
render(Website, document.body);

onAuthStateChanged(getAuth(), (user) => {
  // sign in user if did not logged out
  if (user) signIn(user.uid);
});
