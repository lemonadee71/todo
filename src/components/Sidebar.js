import Sortable from 'sortablejs';
import { createHook, html, render } from 'poor-man-jsx';
import { PROJECT } from '../actions';
import { useRoot } from '../core/hooks';
import Core from '../core';
import ProjectLink from './ProjectLink';
import { AddIcon, CloseIcon, HomeIcon } from '../assets/icons';

const Sidebar = () => {
  const [data, revoke] = useRoot();
  const [state] = createHook({ isVisible: false });

  const toggleVisibility = () => {
    state.isVisible = !state.isVisible;
  };

  const createNewProject = (e) => {
    const input = e.target.elements['new-project'];

    Core.event.emit(
      PROJECT.ADD,
      {
        data: { name: input.value },
      },
      {
        onSuccess: () => {
          if (e.target.dataset.clear) {
            input.value = '';
          }
        },
      }
    );
  };

  const init = function () {
    Sortable.create(this, {
      animation: 150,
      // delay: 10,
      draggable: 'li',
      onUpdate: (e) => {
        Core.event.emit(PROJECT.MOVE, {
          project: e.item.dataset.id,
          data: { position: e.newIndex },
        });
      },
    });
  };

  // prettier-ignore
  return html`
    <aside
      class="${state.$isVisible(value => value ? 'w-56' : 'w-0')} sm:w-56 fixed top-0 left-0 h-screen bg-[#272727] z-50 overflow-x-hidden overflow-y-auto transition-all dark:bg-[#202020]"
      id="sidebar"
      onToggleSidebar=${toggleVisibility}
      onDestroy=${revoke}
    >
      <div class="relative h-full p-5 pt-12">
        <button
          class="absolute top-4 right-4 ${state.$isVisible(value => value ? 'visible' : 'invisible')} sm:invisible"
          onClick=${toggleVisibility}
        >
          ${CloseIcon('stroke-gray-400 hover:stroke-gray-600 dark:stroke-gray-50 dark:hover:stroke-gray-200')}
        </button>

        <nav class="">
          <a
            class="no-underline hover:underline text-sm text-white flex items-center mb-8"
            is="navigo-link"
            href="/app"
          >
            ${HomeIcon('stroke-white mr-1', 16)} Home
          </a>

          <div class="flex justify-between">
            <h2 class="font-bold text-sm text-neutral-400 tracking-wide mb-1">
              PROJECTS
            </h2>
            <!-- Quick add -->
            <form onSubmit.prevent=${createNewProject}>
              <button
                class="rounded border border-solid border-neutral-400 hover:bg-neutral-700"
                data-tooltip="Add new project"
                type="submit"
              >
                ${AddIcon('stroke-neutral-400', 16, 1.25)}
              </button>
              <input type="hidden" name="new-project" value="Unnamed project" />
            </form>
          </div>

          <ul
            is-list
            keystring="data-id"
            class="space-y-1 m-0"
            onCreate=${init}
          >
            ${data.$projects.map(ProjectLink).map((item) => render(item))}
          </ul>
        </nav>

        <div class="absolute bottom-6 w-48">
          <form
            class="flex w-full"
            data-clear="onsuccess"
            onSubmit.prevent=${createNewProject}
          >
            <button type="submit">${AddIcon('stroke-gray-400')}</button>
            <input
              type="text"
              name="new-project"
              placeholder="Add project"
              class="w-full text-white text-sm rounded-sm ml-1 px-1 py-1 bg-transparent placeholder:text-gray-400 focus:bg-white focus:text-black focus:ring "
            />
          </form>
        </div>
      </div>
    </aside>
  `;
};

export default Sidebar;
