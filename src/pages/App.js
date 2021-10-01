import { html } from 'poor-man-jsx';
import 'github-markdown-css';
import { PATHS } from '../core/constants';
import Core from '../core';
import Sidebar from '../components/Sidebar';
import Router from '../components/Router';
import Overview from './Overview';
import Calendar from './Calendar';
import Project from './Project';

Core.router.on(PATHS.allApp, null, {
  before: (done, match) => {
    const newURL = match.url;
    const isNavigatingToApp =
      !Core.router.matchLocation(PATHS.allApp) && newURL.startsWith(PATHS.app);

    if (isNavigatingToApp) Core.init();

    // This causes unnecessary renders for app
    // by always rerendering even if still on the same path
    done();
  },
});

const App = (match) => {
  // const showSidebar = (e) => {
  //   e.currentTarget.classList.toggle('is-active');
  // };

  const routes = [
    {
      path: PATHS.app,
      component: Overview,
    },
    {
      path: PATHS.calendar,
      component: Calendar,
    },
    {
      path: PATHS.project,
      component: Project,
    },
  ];

  return html`
    <!-- <header>
      <ul>
        <li>
          <button class="hamburger hamburger--slider-r" type="button">
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </button>
        </li>
        <li><h1>ToDo</h1></li>
      </ul>
    </header> -->
    <ul>
      <li><a is="navigo-link" href="/app">Overview</a></li>
      <li><a is="navigo-link" href="/app/calendar">Calendar</a></li>
    </ul>
    ${Sidebar()} ${Router(routes, match)}
  `;
};

export default App;
