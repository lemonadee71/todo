import Sortable from 'sortablejs';
import { html, render } from 'poor-man-jsx';
import { PROJECT } from '../core/actions';
import { useRoot } from '../core/hooks';
import Core from '../core';
import ProjectLink from './ProjectLink';
import { AddIcon } from '../assets/icons';

const Sidebar = () => {
  const [data, revoke] = useRoot();

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
      delay: 10,
      draggable: 'li',
      onUpdate: (e) => {
        Core.event.emit(PROJECT.MOVE, {
          project: e.item.dataset.id,
          data: { position: e.newIndex },
        });
      },
    });
  };

  return html`
    <aside
      class="invisible sm:visible fixed left-0 w-56 h-screen p-5 bg-[#272727] z-50 overflow-x-hidden overflow-y-auto transition-all"
      id="sidebar"
      onDestroy=${revoke}
    >
      <div class="relative h-full">
        <nav class="">
          <ul class="space-y-1 m-0 mb-6">
            <li>
              <a
                class="no-underline hover:underline text-sm text-white"
                href="#"
              >
                User
              </a>
            </li>
            <li>
              <a
                class="no-underline hover:underline text-sm text-white"
                is="navigo-link"
                href="/app"
              >
                Overview
              </a>
            </li>
          </ul>

          <div class="flex flex-row justify-between">
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

        <div class="absolute bottom-6 w-full">
          <form
            class="flex flex-row"
            data-clear="success"
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
