import { compareAsc, parseISO } from 'date-fns';
import { createHook, html, render } from 'poor-man-jsx';
import Sortable from 'sortablejs';
import { useRoot } from '../core/hooks';
import Core from '../core';
import { PROJECT, TASK } from '../actions';
import { getProfilePicURL, getUserName } from '../utils/auth';
import { AddIcon } from '../assets/icons';
import ProjectCard from '../components/Dashboard/ProjectCard';
import Task from '../components/Dashboard/Task';

const Dashboard = () => {
  const [root, unsubscribe] = useRoot();
  const [tasks] = createHook({
    dueThisWeek: Core.main.getTasksDueThisWeek(),
    stale: Core.main.getStaleTasks(),
  });
  const cleanup = [unsubscribe];

  const createNewProject = () => {
    Core.event.emit(PROJECT.ADD, { data: { name: 'Unnamed project' } });
  };

  const init = function () {
    Sortable.create(this, {
      animation: 150,
      draggable: '[data-position]',
      onUpdate: (e) => {
        Core.event.emit(PROJECT.MOVE, {
          project: e.item.dataset.id,
          data: { position: e.newIndex },
        });
      },
    });
  };

  // for some reason this doesn't work if we don't do it like this
  cleanup.push(
    Core.event.onSuccess(
      [...PROJECT.LABELS.ALL, ...TASK.ALL, ...TASK.LABELS.ALL],
      () => {
        tasks.dueThisWeek = Core.main.getTasksDueThisWeek();
        tasks.stale = Core.main.getStaleTasks();
      }
    )
  );

  return html`
    <div
      class="h-20 grid grid-cols-[auto_1fr] grid-rows-2 px-6 shadow-md bg-white dark:bg-[#353535]"
      onDestroy=${() => cleanup.map((fn) => fn())}
    >
      <img
        class="row-span-2 rounded-full h-14 w-14 mr-6 active:ring-teal-500 self-center"
        src="${getProfilePicURL()}"
        alt="profile picture"
      />
      <p class="font-bold tracking-wide text-sm self-end">Hi there,</p>
      <p class="font-bold tracking-wide text-2xl self-start">
        ${getUserName()}
      </p>
    </div>

    <div
      class="flex-1 grid auto-rows-min xs:grid-cols-2 lg:grid-rows-2 lg:grid-cols-[1fr_minmax(14rem,18rem)] gap-x-6 gap-y-4 px-6 overflow-auto scrollbar"
    >
      <div
        class="xs:col-span-2 xs:row-auto lg:col-span-1 lg:row-span-2 flex flex-col overflow-auto scrollbar"
      >
        <div class="flex justify-between items-center">
          <h2 class="font-semibold text-lg mb-3">Your Projects</h2>
          <button
            class="group rounded border border-solid border-neutral-400 hover:border-blue-400 hover:bg-blue-100"
            data-tooltip="Create new project"
            onClick=${createNewProject}
          >
            ${AddIcon(
              'stroke-black dark:stroke-white group-hover:stroke-blue-500',
              20,
              1.5
            )}
          </button>
        </div>
        <div
          is-list
          class="flex-1 grid auto-rows-[8rem] grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] content-start gap-3 p-2"
          onMount=${init}
        >
          ${root.$projects((items) =>
            items.map(ProjectCard).map((item) => render(item))
          )}
        </div>
      </div>

      <div class="grid grid-rows-[auto_1fr] gap-3">
        <h2 class="font-semibold text-lg">Due This Week</h2>
        <div is-list class="px-2 space-y-1 overflow-auto scrollbar">
          ${tasks.$dueThisWeek((items) =>
            // BUG: See https://github.com/lemonadee71/poor-man-jsx/issues/27
            items
              .sort((a, b) =>
                compareAsc(parseISO(a.dueDate), parseISO(b.dueDate))
              )
              .map((data, i) => Task(data, i, false))
              .map((data) => render(data))
          )}
        </div>
      </div>

      <div class="grid grid-rows-[auto_1fr] gap-3">
        <h2 class="font-semibold text-lg">Stale Tasks</h2>
        <div is-list class="px-2 space-y-1 overflow-auto scrollbar">
          ${tasks.$stale((items) =>
            items
              .sort((a, b) =>
                compareAsc(parseISO(a.lastUpdate), parseISO(b.lastUpdate))
              )
              .map((data, i) => Task(data, i, true))
              .map((data) => render(data))
          )}
        </div>
      </div>
    </div>
  `;
};

export default Dashboard;
