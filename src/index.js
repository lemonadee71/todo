import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import PoorManJSX, { html, render } from 'poor-man-jsx';
import Core from './core';
import { LocalStorage } from './core/storage';
import {
  HIDE_EVENTS,
  LAST_OPENED_PAGE,
  PATHS,
  SHOW_EVENTS,
} from './core/constants';
import { fetchProjects, initFirestore, setupListeners } from './core/firestore';
import { isGuest, isNewUser, signIn } from './utils/auth';
import { useTooltip } from './utils/useTooltip';
import { $$ } from './utils/query';
import defineCustomElements from './components/custom';
import Router from './components/Router';
import Loading from './components/Loading';
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
    nested: true,
    resolver: async (component, match) => {
      // setup core listeners
      Core.setupListeners();
      // setup local storage
      LocalStorage.prefix = `${Core.state.currentUser}__`;

      if (isGuest()) {
        Core.data.root.add(Core.main.getLocalData());
        Core.main.initLocal();

        // to make local work with useSelectLocation
        Core.data.fetched.projects.push(
          ...Core.data.root.items.map((item) => item.id)
        );
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

      return component(match);
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
          await updateDoc(doc(getFirestore(), Core.state.currentUser, 'data'), {
            [LAST_OPENED_PAGE]: data,
          });
        }
      },
      after: async () => {
        let cached;
        if (isGuest()) {
          cached = LocalStorage.get(LAST_OPENED_PAGE);
        } else {
          const document = await getDoc(
            doc(getFirestore(), Core.state.currentUser, 'data')
          );

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
  ${Router({
    routes,
    tag: 'main',
    props: { id: 'main', loadingComponent: Loading },
  })}
  <!-- Only one tooltip element for all -->
  <div id="tooltip" role="tooltip">
    <span id="tooltip_text"></span>
    <div id="tooltip_arrow" data-popper-arrow></div>
  </div>
`;

// add tooltips to elements with data-show-tooltip attr
PoorManJSX.onAfterCreation((element) => {
  $$.data('tooltip-text', null, element).forEach((item) => {
    const [onShow, onHide] = useTooltip(item);

    SHOW_EVENTS.forEach((name) => item.addEventListener(name, onShow()));
    HIDE_EVENTS.forEach((name) => item.addEventListener(name, onHide()));
  });
});

initializeApp(firebaseConfig);
defineCustomElements();
render(Website, document.body);

onAuthStateChanged(getAuth(), (user) => {
  // sign in user if did not logged out
  if (user) signIn(user.uid);
});
