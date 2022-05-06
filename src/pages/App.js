import { getDoc } from 'firebase/firestore';
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
import { getProfilePicURL, getUserName, isGuest, signOut } from '../utils/auth';
import { getDocumentRef } from '../utils/firestore';
import logger from '../utils/logger';
import { orderById } from '../utils/misc';
import { $ } from '../utils/query';
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
    className: 'sm:ml-56 pl-6 pr-2 pt-3 py-2 font-sans flex flex-col h-screen',
    resolver: async (component, match) => {
      if (!isGuest()) {
        const { id } = match.data;

        // only fetch if not cached
        if (!Core.data.fetched.projects.includes(id)) {
          // extra read
          // consider caching results when projects are first fetched
          const data = await fetchProjectData(id);
          const project = Core.data.root.get(id);
          const doc = await getDoc(getDocumentRef('Projects', project.id));

          project.lastFetched = Date.now();
          project.labels.clear().add(data.labels);
          project.lists
            .clear()
            .add(orderById(data.lists, doc.data().lists || []));

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
      $('#modal').push(() => new TaskModal(task).render());
    }),
    Core.event.on(EDIT_SUBTASK, (subtask) => {
      $('#modal').push(() => new SubtaskModal(subtask).render());
    }),
    () => Core.event.clear(),
  ];

  return html`
    <!-- empty element just to cancel subscriptions -->
    <div
      style="display: none;"
      tabindex="-1"
      onDestroy=${() => unsubscribe.forEach((cb) => cb())}
    ></div>
    <!-- header -->
    <header
      class="fixed top-0 w-full flex flex-row justify-between pl-1 pr-4 pt-4 pb-2 mb-1"
    >
      <button
        class="sm:invisible p-1 rounded-full active:ring active:ring-teal-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-gray-800 hover:stroke-gray-600"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#000000"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <polyline points="7 7 12 12 7 17" />
          <polyline points="13 7 18 12 13 17" />
        </svg>
      </button>

      <div class="w-fit flex flex-row justify-between items-center relative">
        <p>Hello, <span class="font-medium">${getUserName()}</span></p>
        <button class="group" data-dropdown="user-menu">
          <img
            class="rounded-full h-6 w-6 ml-2 group-active:ring active:ring-teal-500"
            src="${getProfilePicURL()}"
            alt="profile picture"
          />
        </button>

        <div
          class="flex flex-col bg-neutral-700 text-white text-sm text-center py-1 rounded divide-y divide-neutral-500 drop-shadow z-[2]"
          style="display: none;"
          data-dropdown-id="user-menu"
          data-dropdown-position="bottom-end"
        >
          <button class="px-2">Dark mode</button>
          <button class="px-2 hover:text-red-600" onClick=${signOut}>
            Logout
          </button>
        </div>
      </div>
    </header>
    <!-- sidebar -->
    ${Sidebar()}
    <!-- main content -->
    ${Router({ routes, tag: 'section' })}
    <!-- only one modal for all -->
    <my-modal id="modal"></my-modal>
  `;
};

export default App;
