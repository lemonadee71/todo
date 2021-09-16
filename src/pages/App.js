import { html } from 'poor-man-jsx';
import 'github-markdown-css';
import { $ } from '../utils/query';

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
  `;
};

export default App;
