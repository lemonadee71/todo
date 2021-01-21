import Component from './component.js';
import { compareAsc, format } from 'date-fns';

const root = document.getElementById('root');

const App = (() => {
  const render = () => {
    return Component.createFromString(
      Array.from(
        ...Component.parseString`
      <header>
        <h1>ToDo</h1>
        <input type="text" name="search" ${{
          onKeydown: 'searchTasks',
        }} />
      </header>
      
      <main>
        <div class="container">
          <div id="taskbar">
            <button ${{ onClick: 'addTask' }}>Add Task</button>
          </div>
          <div id="tasks-list">
            <div id="current-tasks"></div>
            <div id="completed-tasks"></div>
          </div>
        </div>
      </main>

      <aside>
        <div id="projects">
          <button ${{ onClick: 'addProject' }}>Add Project</button>
          <div id="def-proj">
            <ul>
              <li>
              <button ${{
                onClick: 'getAll',
              }}>All Tasks</button>All</li>
              <li><button ${{
                onClick: 'getDueToday',
              }}>Today/<button>All</li>
              <li><button ${{
                onClick: 'getDueThisWeek',
              }}>This Week</button>All</li>
              <li><button ${{
                onClick: 'getUpcoming',
              }}>Upcoming</button>All</li>
            </ul>
          </div>
          <div id="user-proj">
            <ul></ul>
          </div>
        </div>
      </aside>

      <div id="modal"></div>

      <footer>
        <p>Created by Shin Andrei Riego</p>
      </footer>
      `
      )
    );
  };

  return {
    render,
  };
})();
