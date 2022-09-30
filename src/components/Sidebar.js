import { createHook, html } from 'poor-man-jsx';
import { PROJECT } from '../actions';
import { useRoot } from '../core/hooks';
import Core from '../core';
import ProjectLink from './ProjectLink';

const Sidebar = () => {
  const [data, revoke] = useRoot();
  const state = createHook({ isVisible: false });

  const toggleVisibility = () => {
    state.isVisible = !state.isVisible;
  };

  const createNewProject = (e) => {
    const input = e.target.elements['new-project'];

    Core.event.emit(PROJECT.ADD, { data: { name: input.value } });
    e.target.reset();
  };

  return html`
    <aside
      id="sidebar"
      class="fixed top-0 left-0 h-screen bg-[#272727] z-50 overflow-x-hidden overflow-y-auto transition-all dark:bg-[#202020] md:visible md:w-56"
      class[visible,w-56|invisible,w-0]=${state.$isVisible}
      onToggleSidebar=${toggleVisibility}
      onDestroy=${revoke}
    >
      <div class="relative h-full p-5 pt-12">
        <button
          class="absolute top-4 right-4 md:invisible"
          class:[visible|invisible]=${state.$isVisible}
          onClick=${toggleVisibility}
        >
          <my-icon
            name="close"
            id="close-sidebar"
            title="Close sidebar"
            class="stroke-gray-400 hover:stroke-gray-600 dark:stroke-gray-50 dark:hover:stroke-gray-2000"
          />
        </button>

        <nav>
          <a
            is="navigo-link"
            class="no-underline hover:underline text-sm text-white flex items-center mb-8"
            href="/app"
          >
            <my-icon
              name="home"
              class="stroke-white mr-1"
              size="16"
              decorative="true"
            />
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
                name="new-project"
                value="Unnamed project"
                type="submit"
                data-tooltip=${{ text: 'Add project', placement: 'right' }}
              >
                <my-icon
                  name="add"
                  id="add_item-project"
                  title="Add project"
                  class="stroke-neutral-400 stroke-1"
                  size="16"
                  decorative="true"
                />
              </button>
            </form>
          </div>

          <ul class="space-y-1 m-0">
            ${data.$projects.map(ProjectLink)}
          </ul>
        </nav>

        <div class="absolute bottom-5 w-48">
          <form
            class="flex w-full"
            data-clear="onsuccess"
            onSubmit.prevent=${createNewProject}
          >
            <div class="flex flex-col space-y-0.5">
              <input
                :validate=${{ ownErrorMessage: true }}
                class="w-full text-white text-sm rounded-sm ml-1 p-1 bg-transparent border-gray-300 border-solid border-b placeholder:text-gray-400 focus:bg-white focus:border-white focus:text-black focus:ring"
                type="text"
                name="new-project"
                placeholder="Add project"
                required
              />
              <p role="alert" class="text-xs text-red-600"></p>
            </div>
            <button type="submit" aria-label="Create new project">
              <my-icon name="add" class="stroke-gray-400" decorative="true" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  `;
};

export default Sidebar;
