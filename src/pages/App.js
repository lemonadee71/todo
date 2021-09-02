import { html } from 'poor-man-jsx';
import $ from '../helpers/helpers';
import { sidebar as sidenav } from '../helpers/selectors';
import MainContent from '../components/MainContent';
import Sidebar from '../components/Sidebar';
import 'github-markdown-css';
import './css/styles.css';
import './css/hamburgers.css';
import './scss/colors.scss';

const App = () => {
  const showSidebar = (e) => {
    e.currentTarget.classList.toggle('is-active');
    $(sidenav).classList.toggle('show');
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
    ${Sidebar()} ${MainContent()}
    <footer>
      <p>
        Icons made by
        <a href="#/test" title="Freepik">Freepik</a>,
        <a href="" title="Gregor Cresnar">Gregor Cresnar</a>,
        <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware"
          >Good Ware</a
        >,
        <a href="https://www.flaticon.com/authors/google" title="Google"
          >Google</a
        >, <a href="" title="Those Icons">Those Icons</a>,
        <a href="https://www.flaticon.com/authors/bqlqn" title="bqlqn">bqlqn</a
        >, and
        <a href="https://creativemarket.com/Becris" title="Becris">Becris</a>
        from
        <a href="https://www.flaticon.com/" title="Flaticon"
          >www.flaticon.com</a
        >
      </p>
      <p>Created by Shin Andrei Riego</p>
    </footer>
  `;
};

export default App;
