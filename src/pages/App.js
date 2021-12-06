import { html } from 'poor-man-jsx';
import Core from '../core';
import { PATHS } from '../core/constants';
import { EDIT_SUBTASK, EDIT_TASK, PROJECT, TASK } from '../core/actions';
import { wrap } from '../utils/misc';
import { $ } from '../utils/query';
import logger from '../utils/logger';
import { signOut } from '../utils/auth';
import Overview from './Overview';
import Calendar from './Calendar';
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
    path: PATHS.calendar,
    component: Calendar,
  },
  {
    path: PATHS.project,
    component: Project,
  },
];

const App = () => {
  // initialize data
  Core.init();

  // listeners
  const unsubscribe = [
    Core.event.onError(
      [PROJECT.LISTS.ADD, PROJECT.LABELS.ADD],
      wrap(logger.warning)
    ),
    Core.event.onError(
      [
        PROJECT.UPDATE,
        PROJECT.LABELS.UPDATE,
        PROJECT.LISTS.UPDATE,
        TASK.UPDATE,
        TASK.SUBTASKS.UPDATE,
      ],
      wrap(logger.error)
    ),
    Core.event.onError(PROJECT.ADD, wrap(logger.warning)),
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
  ];

  return html`
    <div id="app" ${{ onDestroy: () => unsubscribe.forEach((cb) => cb()) }}>
      <button ${{ onClick: signOut }}>Logout</button>
      ${Sidebar()}${Router({ routes, props: { id: 'main-content' } })}
    </div>
    <div id="tooltip" class="tooltip">
      <span></span>
      <div class="arrow" data-popper-arrow></div>
    </div>
    <my-modal id="main-modal" close-btn-class="modal__close-btn"></my-modal>
  `;
};

export default App;
