import { html } from 'poor-man-jsx';
import Core from '../core';
import { PATHS } from '../core/constants';
import {
  EDIT_SUBTASK,
  EDIT_TASK,
  PROJECT,
  REDIRECT,
  TASK,
} from '../core/actions';
import { fetchProjectData } from '../core/firestore';
import { $ } from '../utils/query';
import logger from '../utils/logger';
import { isGuest, signOut } from '../utils/auth';
import Overview from './Overview';
import Project from './Project';
import Sidebar from '../components/Sidebar';
import Router from '../components/Router';
import TaskModal from '../components/Project/TaskModal';
import SubtaskModal from '../components/Project/SubtaskModal';

const routes = [
  {
    path: PATHS.app,
    component: Overview,
  },
  {
    path: PATHS.project,
    component: Project,
    resolver: async (component, match) => {
      if (!isGuest()) {
        const { id } = match.data;

        // only fetch if not cached
        if (!Core.data.fetched.projects.includes(id)) {
          const data = await fetchProjectData(id);
          const project = Core.data.root.get(id);

          project.lastFetched = Date.now();
          project.labels.clear().add(data.labels);
          project.lists.clear().add(data.lists);

          // mark project as fetched
          Core.data.fetched.projects.push(id);
        }

        Core.main.init(Core.data.root.items);
      }

      return component(match);
    },
  },
];

const App = () => {
  // listeners
  const unsubscribe = [
    Core.event.on(REDIRECT, (data) => {
      if (Core.state.currentPage === `app/${data.link}`) {
        Core.router.redirect(PATHS.app, { title: 'Overview' });
      }
    }),
    Core.event.onError(
      [PROJECT.ADD, PROJECT.LISTS.ADD, PROJECT.LABELS.ADD],
      ({ e }) => logger.warning(e)
    ),
    Core.event.onError(
      [
        PROJECT.UPDATE,
        PROJECT.LABELS.UPDATE,
        PROJECT.LISTS.UPDATE,
        TASK.UPDATE,
        TASK.SUBTASKS.UPDATE,
      ],
      ({ e }) => logger.error(e)
    ),
    Core.event.on(EDIT_TASK, (task) => {
      $('#main-modal').changeContent(
        new TaskModal(task).render(),
        'task-modal'
      );
    }),
    Core.event.on(EDIT_SUBTASK, (subtask) => {
      $('#main-modal').changeContent(
        new SubtaskModal(subtask).render(),
        'task-modal'
      );
    }),
    () => Core.event.clear(),
  ];

  return html`
    <div id="app" onDestroy=${() => unsubscribe.forEach((cb) => cb())}>
      <button onClick=${signOut}>Logout</button>
      ${Sidebar()}${Router({ routes, props: { id: 'main-content' } })}
    </div>
    <my-modal id="main-modal" close-btn-class="modal__close-btn"></my-modal>
  `;
};

export default App;
