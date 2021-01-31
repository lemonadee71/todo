import Component from '../helpers/component.js';
import ProjectListItem from './ProjectListItem.js';

const Sidebar = ({
  projects,
  getAllTasks,
  getDueToday,
  getDueThisWeek,
  getUpcoming,
  createNewProject,
  selectProject,
}) => {
  return Component.parseString`
  <aside id="projects">
    <div>
      <ul id="default-proj">
        <li ${{ onClick: getAllTasks }}>All Tasks</li>
        <li>Today</li>
        <li>This Week</li>
        <li>Upcoming</li>
      </ul>
      <br />
    </div>
    <div>
      <form ${{ onSubmit: createNewProject }}>
        <input
          type="text"
          name="new-project"
          class="dark"
          id="new-proj"
          placeholder="Create New Project"
        />
        <button type="submit">+</button>
      </form>
      <br />
      <ul id="user-proj">
        ${
          projects
            ? projects.map((proj) =>
                ProjectListItem(proj, selectProject)
              )
            : ''
        }
      </ul>
    </div>
  </aside>
  `;
};

export default Sidebar;
