import Sortable from 'sortablejs';
import { createHook, html, render } from 'poor-man-jsx';
import { PROJECT } from '../core/actions';
import { useProject } from '../core/hooks';
import Core from '../core';
import Calendar from '../components/Calendar';
import List from '../components/Project/List';

const Project = ({ data: { id } }) => {
  const [project, unsubscribe] = useProject(id);
  const [state] = createHook({ isListView: true, openForm: false });

  const switchView = () => {
    state.isListView = !state.isListView;
  };

  const toggleListFormVisibility = () => {
    state.openForm = !state.openForm;
  };

  const createNewList = (e) => {
    const input = e.target.elements['new-list'];

    Core.event.emit(
      PROJECT.LISTS.ADD,
      {
        project: project.id,
        data: { name: input.value },
      },
      {
        onSuccess: () => {
          input.value = '';
          toggleListFormVisibility();
        },
      }
    );
  };

  const init = function () {
    Sortable.create(this, {
      animation: 150,
      draggable: '.tasklist',
      filter: '.task,.subtask',
      onUpdate: (e) => {
        Core.event.emit(PROJECT.LISTS.MOVE, {
          project: project.id,
          list: e.item.id,
          data: { position: e.newIndex },
        });
      },
    });
  };

  const form = html`
    <div
      ignore-all
      key="list-form"
      class="w-60 p-2 rounded-lg opacity-80 bg-[#dedede]"
    >
      ${state.$openForm((value) =>
        value
          ? render(html`
              <form class="w-full" onSubmit.prevent=${createNewList}>
                <input
                  class="w-full px-2 py-1 mb-1 text-sm rounded-sm placeholder-slate-400"
                  type="text"
                  name="new-list"
                  placeholder="Enter list name..."
                />
                <div class="flex flex-row items-center space-x-1">
                  <button
                    class="text-white text-sm w-fit px-2 py-1 rounded bg-blue-700 hover:bg-blue-800"
                    type="submit"
                  >
                    Add list
                  </button>
                  <button
                    type="reset"
                    data-tooltip-text="Cancel"
                    data-tooltip-position="right"
                    onClick=${toggleListFormVisibility}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="stroke-black hover:stroke-red-600"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="#000000"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </form>
            `)
          : render(html`
              <button
                class="w-full p-1 bg-transparent font-sans text-black text-sm hover:text-gray-800 group flex flex-row items-center space-x-3"
                onClick=${toggleListFormVisibility}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-black group-hover:stroke-gray-800"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="#ffffff"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add another list</span>
              </button>
            `)
      )}
    </div>
  `;

  return html`
    <header
      data-name="project__name"
      class="w-full flex justify-between items-center"
      onDestroy=${unsubscribe}
    >
      <h1 class="text-3xl font-extrabold mt-8 mb-6">${project.$name}</h1>
      <button
        class="text-sm text-black bg-neutral-400 px-3 py-2 rounded"
        onClick=${switchView}
      >
        ${state.$isListView((value) => (value ? 'List' : 'Calendar'))} view
      </button>
    </header>

    <div data-name="project__content">
      ${state.$isListView((value) =>
        value
          ? render(html`
              <div
                is-list
                keystring="id"
                class="flex flex-row items-start space-x-6"
                onCreate=${init}
              >
                ${project.$lists((projects) =>
                  [...projects.map(List), form].map((item) => render(item))
                )}
              </div>
            `)
          : render(Calendar(id))
      )}
    </div>
  `;
};

export default Project;
