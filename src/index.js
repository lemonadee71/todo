import Component from './helpers/component';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import $ from './helpers/helpers';
import { hamburger, sidebar as sidenav } from './helpers/selectors';
import {
  createNewProject,
  selectProject,
  removeProject,
  selectAllTasks,
  getProjectsDetails,
  showCreateTaskForm,
} from './controller';

const App = () => {
  const showSidebar = (e) => {
    e.currentTarget.classList.toggle('is-active');
    $(sidenav).classList.toggle('show');
  };

  return Component.render(Component.parseString`
      <header>
        <ul>
          <li>
            <button ${{
              onClick: showSidebar,
            }} class="hamburger hamburger--slider-r" type="button">
              <span class="hamburger-box">
                <span class="hamburger-inner"></span>
              </span>
            </button>
          </li>
          <li><h1>ToDo</h1></li>
        </ul>
        <input
          type="text"
          name="search"
          class="dark"
          id="search-bar"
          placeholder="Search your tasks"
        />
      </header>
      ${Sidebar({
        selectProject,
        removeProject,
        createNewProject,
        getAllTasks: selectAllTasks,
        projects: getProjectsDetails(),
      })}
      ${MainContent({ onAddBtnClick: showCreateTaskForm })}
      <footer>
        <p>
          Icons made by
          <a href="https://www.freepik.com" title="Freepik">Freepik</a>,
          <a href="" title="Gregor Cresnar">Gregor Cresnar</a>,
          <a
            href="https://www.flaticon.com/authors/good-ware"
            title="Good Ware"
            >Good Ware</a
          >,
          <a
            href="https://www.flaticon.com/authors/google"
            title="Google"
            >Google</a
          >, <a href="" title="Those Icons">Those Icons</a>,
          <a href="https://www.flaticon.com/authors/bqlqn" title="bqlqn"
            >bqlqn</a
          >, and
          <a href="https://creativemarket.com/Becris" title="Becris"
            >Becris</a
          >
          from
          <a href="https://www.flaticon.com/" title="Flaticon"
            >www.flaticon.com</a
          >
        </p>
        <p>Created by Shin Andrei Riego</p>
      </footer>
    `);
};

document.body.prepend(App());
