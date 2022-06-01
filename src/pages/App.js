import PoorManJSX, { html } from 'poor-man-jsx';
import { HIDE_EVENTS, PATHS, SHOW_EVENTS } from '../constants';
import {
  CHANGE_THEME,
  EDIT_SUBTASK,
  EDIT_TASK,
  PROJECT,
  TASK,
} from '../actions';
import Core from '../core';
import { fetchProjectData } from '../core/firestore';
import { getProfilePicURL, getUserName, isGuest, signOut } from '../utils/auth';
import { dispatchCustomEvent } from '../utils/dispatch';
import logger from '../utils/logger';
import { orderById } from '../utils/misc';
import { $, $$ } from '../utils/query';
import { toggleDarkTheme } from '../utils/theme';
import { useTooltip } from '../utils/useTooltip';
import Dashboard from './Dashboard';
import Project from './Project';
import Sidebar from '../components/Sidebar';
import Router from '../components/Router';
import TaskModal from '../components/Project/TaskModal';
import SubtaskModal from '../components/Project/SubtaskModal';
import Loading from '../components/Loading';

const routes = [
  {
    path: PATHS.app,
    component: Dashboard,
    className: 'gap-6 bg-neutral-200 dark:bg-[#424242]',
  },
  {
    path: PATHS.project,
    component: Project,
    className: 'pl-6 pr-2',
    beforeRender: async (match) => {
      if (!isGuest()) {
        const { id } = match.data;

        // only fetch if not cached
        if (!Core.data.fetched.projects.includes(id)) {
          const data = await fetchProjectData(id);
          const project = Core.data.root.get(id);

          project.lastFetched = Date.now();
          // clear defaults
          project.labels.clear().add(data.labels);
          project.lists
            .clear()
            .add(orderById(data.lists, project.__initialListsOrder));

          // mark project as fetched
          Core.data.fetched.projects.push(id);
        }

        Core.main.init(Core.data.root.items);
      }
    },
  },
];

const App = () => {
  const addTooltip = (element) => {
    // BUG: Runs multiple times even though the element is only created once
    //      especially for elements under `is-list`
    $$.data('tooltip', null, element).forEach((item) => {
      // Manually use `useTooltip` for `is-list` items
      if (item.dataset.tooltipManual) return;

      item.addEventListener('@mount', () => {
        const [onShow, onHide] = useTooltip(item);

        SHOW_EVENTS.forEach((name) => item.addEventListener(name, onShow()));
        HIDE_EVENTS.forEach((name) => item.addEventListener(name, onHide()));
      });
    });
  };

  // add tooltips to elements with data-tooltip attr
  // only app/* page has tooltips
  PoorManJSX.onAfterCreation(addTooltip);

  // listeners
  const cleanup = [
    () => PoorManJSX.removeAfterCreation(addTooltip),
    Core.event.on(CHANGE_THEME, toggleDarkTheme),
    Core.event.onSuccess(
      PROJECT.REMOVE,
      (data) => {
        if (Core.state.currentPage === `app/${data.link}`) {
          Core.router.redirect(PATHS.app, { title: 'Home' });
        }
      },
      { order: 'last' }
    ),
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
      onDestroy=${() => cleanup.forEach((cb) => cb())}
    ></div>
    <!-- header -->
    <header
      class="fixed top-0 right-0 w-full h-14 flex flex-row justify-between pl-1 pr-4 pt-4 pb-2 bg-inherit z-50"
    >
      <button
        class="md:invisible p-1 rounded-full active:ring active:ring-teal-500"
        onClick=${() => dispatchCustomEvent($('#sidebar'), 'togglesidebar')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-gray-800 hover:stroke-gray-600 dark:stroke-white dark:hover:stroke-gray-300"
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
        <p class="font-medium">${getUserName()}</p>
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
          data-dropdown-offset="0,10"
        >
          <button class="px-2" onClick=${() => Core.event.emit(CHANGE_THEME)}>
            ${Core.state.$darkTheme((value) => (value ? 'Light' : 'Dark'))} mode
          </button>
          <button class="px-2 hover:text-red-600" onClick=${signOut}>
            Logout
          </button>
        </div>
      </div>
    </header>
    <!-- sidebar -->
    ${Sidebar()}
    <!-- main content -->
    ${Router({
      routes,
      tag: 'main',
      loadingComponent: () => Loading('h-[calc(100vh-80px)]', 'w-8 h-8'),
      // used padding instead of margin to avoid overflow issues
      props: { class: 'flex flex-col h-full pt-14' },
    })}
    <!-- only one modal for all -->
    <my-modal id="modal"></my-modal>
    <!-- only one tooltip element for all -->
    <div id="tooltip" role="tooltip">
      <span id="tooltip_text"></span>
      <div id="tooltip_arrow" data-popper-arrow></div>
    </div>
  `;
};

export default App;
