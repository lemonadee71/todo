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

  // prettier-ignore
  return html`
    <aside
      class="${state.$isVisible((value) => value ? 'visible w-56' : 'invisible w-0')} md:visible md:w-56 fixed top-0 left-0 h-screen bg-[#272727] z-50 overflow-x-hidden overflow-y-auto transition-all dark:bg-[#202020]"
      id="sidebar"
      onToggleSidebar=${toggleVisibility}
      onDestroy=${revoke}
    >
      <div class="relative h-full p-5 pt-12">
        <button
          class="absolute top-4 right-4 ${state.$isVisible((value) =>  value ? 'visible' : 'invisible')} md:invisible"
          onClick=${toggleVisibility}
        >
          ${CloseIcon({
            cls: 'stroke-gray-400 hover:stroke-gray-600 dark:stroke-gray-50 dark:hover:stroke-gray-200',
            id: 'close-sidebar',
            title: 'Close sidebar',
          })}
        </button>

        <nav class="">
          <a
            class="no-underline hover:underline text-sm text-white flex items-center mb-8"
            is="navigo-link"
            href="/app"
          >
            ${HomeIcon({
              cls: 'stroke-white mr-1',
              size: 16,
              decorative: true,
            })}
            Home
          </a>

          <div class="flex justify-between">
            <h2 class="font-bold text-sm text-neutral-400 tracking-wide mb-1">
              PROJECTS
            </h2>
            <!-- Quick add -->
            <form onSubmit.prevent=${createNewProject}>
              <button
                class="rounded border border-solid border-neutral-400 hover:bg-neutral-700"
                data-tooltip="Add project"
                data-tooltip-position="right"
                name="new-project"
                value="Unnamed project"
                type="submit"
              >
                ${AddIcon({
                  cls: 'stroke-neutral-400 stroke-1',
                  size: 16,
                  id: 'add_item-project',
                  title: 'Add project',
                })}
              </button>
            </form>
          </div>

          <ul is-list keystring="data-id" class="space-y-1 m-0">
            ${data.$projects.map(ProjectLink).map((item) => render(item))}
          </ul>
        </nav>

        <div class="absolute bottom-6 w-48">
          <form
            class="flex w-full"
            data-clear="onsuccess"
            onSubmit.prevent=${createNewProject}
          >
            <input
              type="text"
              name="new-project"
              placeholder="Add project"
              class="w-full text-white text-sm rounded-sm ml-1 px-1 py-1 bg-transparent placeholder:text-gray-400 focus:bg-white focus:text-black focus:ring "
            />
            <button type="submit" aria-label="Create new project">
              ${AddIcon({ cls: 'stroke-gray-400', decorative: true })}
            </button>
          </form>
        </div>
      </div>
    </aside>
  `;
};

export default Sidebar;
