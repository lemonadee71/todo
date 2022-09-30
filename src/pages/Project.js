import Sortable from 'sortablejs';
import { createHook, html } from 'poor-man-jsx';
import { EDIT_TASK, PROJECT } from '../actions';
import { useProject } from '../core/hooks';
import Core from '../core';
import Calendar from '../components/Calendar';
import List from '../components/Project/List';

const Project = ({ data: { id } }) => {
  const [project, unsubscribe] = useProject(id);
  const state = createHook({ isListView: true, openForm: false });

  const switchView = () => {
    state.isListView = !state.isListView;
  };

  const toggleFormVisibility = () => {
    state.openForm = !state.openForm;
  };

  // We put this here since Router hooks aren't called sequentially
  const openTask = () => {
    const data = Core.data.queue.pop();

    if (data) {
      Core.event.emit(
        EDIT_TASK,
        // make root the source to use the completed data we just fetched
        Core.main.getTask(data.project, data.list, data.task)
      );
    }
  };

  const editProject = (e) => {
    if (e.detail && !e.detail.isValid) return;

    Core.event.emit(PROJECT.UPDATE, {
      project: id,
      data: { [e.target.name]: e.target.value },
    });
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
          toggleFormVisibility();
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
      :key="list-form"
      no-diff
      class="w-60 p-2 rounded-lg opacity-80 bg-[#dedede] dark:bg-[#272727]"
    >
      ${state.$openForm((value) =>
        value
          ? html`<form class="w-full" onSubmit.prevent=${createNewList}>
              <div class="flex flex-col space-y-0.5 mb-2">
                <label
                  for="new-list-name"
                  class="text-sm text-gray-800 dark:text-white after:content-['*'] after:text-red-600"
                >
                  List name
                </label>
                <input
                  :validate=${{ showError: true }}
                  class="w-full px-2 py-1 mb-1 text-sm rounded-sm placeholder-slate-400 dark:text-black dark:bg-white focus:ring"
                  type="text"
                  name="new-list"
                  id="new-list-name"
                  required
                />
              </div>
              <div class="flex flex-row items-center space-x-1">
                <button
                  class="text-white text-sm w-fit px-2 py-1 rounded bg-blue-700 hover:bg-blue-800"
                  type="submit"
                >
                  Add list
                </button>
                <button
                  type="reset"
                  data-tooltip-position="right"
                  onClick=${toggleFormVisibility}
                >
                  <my-icon
                    name="close"
                    id="cancel-list-creation"
                    title="Cancel"
                    class="stroke-black hover:stroke-red-600 dark:stroke-white"
                  />
                </button>
              </div>
            </form>`
          : html`<button
              :else
              class="w-full p-1 bg-transparent text-sm hover:text-gray-800 group flex flex-row items-center space-x-3 dark:hover:text-gray-300"
              onClick=${toggleFormVisibility}
            >
              <my-icon
                name="add"
                class="stroke-black group-hover:stroke-gray-800 dark:stroke-white dark:group-hover:stroke-gray-300"
                decorative="true"
              />
              <span>Add another list</span>
            </button>`
      )}
    </div>
  `;

  return html`
    <div
      data-name="project__name"
      class="flex justify-between items-center mb-5"
      onMount=${openTask}
      onDestroy=${unsubscribe}
    >
      <h1 class="sr-only">${project.$name}</h1>
      <div class="w-3/4 pt-2 flex items-center">
        <label
          class="relative rounded-full mr-3 select-none cursor-pointer focus-within:ring focus-within:ring-offset-2"
        >
          <span class="sr-only">Choose project color</span>
          <input
            class="absolute w-0 h-0 opacity-0"
            type="color"
            name="color"
            value=${project.color}
            onChange=${editProject}
          />
          <div
            class="w-4 h-4 rounded-full"
            style="background-color: ${project.$color};"
          ></div>
        </label>
        <label for="project-name" class="sr-only">Project name</label>
        <auto-textarea
          :validate=${{ type: 'aggressive', delay: 200 }}
          class="flex-1 text-2xl font-extrabold bg-inherit placeholder:text-lg placeholder:text-slate-600 placeholder:font-normal dark:placeholder:text-slate-300"
          id="project-name"
          name="project-name"
          placeholder="Project name (required)"
          value=${project.name}
          onValidate=${editProject}
        />
      </div>

      <button
        class="px-3 py-2 rounded active:ring"
        data-tooltip="Switch to ${state.$isListView((value) =>
          value ? 'calendar' : 'list'
        )} view"
        onClick=${switchView}
      >
        ${state.$isListView((value) =>
          value
            ? html`<my-icon
                name="calendar"
                id="toggle-calendar"
                title="Switch to calendar view"
                class="stroke-gray-800 dark:stroke-white stroke-2"
              />`
            : html`<my-icon
                name="list"
                id="toggle-list"
                title="Switch to list view"
                class="stroke-gray-800 dark:stroke-white stroke-2"
              />`
        )}
      </button>
    </div>

    <div class="flex-1 overflow-x-auto scrollbar" data-name="project__content">
      ${state.$isListView((value) =>
        value
          ? html`
              <div
                class="w-fit p-2 flex flex-row items-start space-x-6"
                onMount=${init}
              >
                ${project.$lists((lists) => [...lists.map(List), form])}
              </div>
            `
          : Calendar(id)
      )}
    </div>
  `;
};

export default Project;
