import { html } from 'poor-man-jsx';
import 'github-markdown-css';
import { PATHS } from '../core/constants';
import Core from '../core';

Core.router.on(PATHS.allApp, null, {
  before: (done, match) => {
    const newURL = match.url;
    const isNavigatingToApp =
      !Core.router.matchLocation(PATHS.allApp) && newURL.startsWith(PATHS.app);

    if (isNavigatingToApp) Core.init();

    done();
  },
});

const App = () => {
  const showSidebar = (e) => {
    e.currentTarget.classList.toggle('is-active');
    // $(sidenav).classList.toggle('show');
  };

  return html`
    <header>
      <ul>
        <li>
          <button
            class="hamburger hamburger--slider-r"
            type="button"
            ${{ onClick: showSidebar }}
          >
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </button>
        </li>
        <li><h1>ToDo</h1></li>
      </ul>
    </header>
    <h2>This is my app page</h2>
  `;
};

export default App;
