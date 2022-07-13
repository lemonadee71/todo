import Sortable from 'sortablejs';
import { createHook, html, render } from 'poor-man-jsx';
import { EDIT_TASK, PROJECT } from '../actions';
import { useProject } from '../core/hooks';
import Core from '../core';
import Calendar from '../components/Calendar';
import List from '../components/Project/List';
import { AddIcon, CalendarIcon, CloseIcon, ListIcon } from '../assets/icons';

const Project = ({ data: { id } }) => {
  const [project, unsubscribe] = useProject(id);
  const [state] = createHook({ isListView: true, openForm: false });

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
    if (!e.detail?.isValid) return;

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
      ignore-all
      key="list-form"
      class="w-60 p-2 rounded-lg opacity-80 bg-[#dedede] dark:bg-[#584040]"
    >
      ${state.$openForm((value) =>
        value
          ? render(html`
              <form class="w-full" onSubmit.prevent=${createNewList}>
                <div class="flex flex-col space-y-0.5 mb-2">
                  <label
                    for="new-list-name"
                    class="text-sm text-gray-800 dark:text-gray-100 after:content-['*'] after:text-red-600"
                  >
                    List name
                  </label>
                  <input
                    class="w-full px-2 py-1 mb-1 text-sm rounded-sm placeholder-slate-400 dark:text-black focus:ring"
                    type="text"
                    name="new-list"
                    id="new-list-name"
                    data-validate
                    data-validate-show-error
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
                    aria-label="Cancel"
                    data-tooltip="{{aria-label}}"
                    data-tooltip-position="right"
                    onClick=${toggleFormVisibility}
                  >
                    ${CloseIcon({
                      cls: 'stroke-black hover:stroke-red-600 dark:stroke-white dark:hover:stroke-red-400',
                      size: 24,
                    })}
                  </button>
                </div>
              </form>
            `)
          : render(html`
              <button
                class="w-full p-1 bg-transparent text-sm hover:text-gray-800 group flex flex-row items-center space-x-3 dark:hover:text-gray-300"
                onClick=${toggleFormVisibility}
              >
                ${AddIcon({
                  cls: 'stroke-black group-hover:stroke-gray-800 dark:stroke-white dark:group-hover:stroke-gray-300',
                  decorative: true,
                })}
                <span>Add another list</span>
              </button>
            `)
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
        <!-- prettier-ignore -->
        <textarea
          class="flex-1 text-2xl font-extrabold p-1 rounded-sm bg-inherit resize-none break-words overflow-hidden placeholder:text-slate-600 focus:ring marker:dark:placeholder:text-slate-400"
          id="project-name"
          name="name"
          placeholder="Project name"
          data-schema="title"
          data-validate="aggressive"
          data-validate-delay="200"
          onValidate=${editProject}
        >${project.name}</textarea>
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
            ? render(
                CalendarIcon({
                  cls: 'stroke-gray-800 dark:stroke-white stroke-2',
                  size: 24,
                  id: 'toggle-calendar',
                  title: 'Switch to calendar view',
                })
              )
            : render(
                ListIcon({
                  cls: 'stroke-gray-800 dark:stroke-white stroke-2',
                  size: 24,
                  id: 'toggle-list',
                  title: 'Switch to list view',
                })
              )
        )}
      </button>
    </div>

    <div class="flex-1 overflow-x-auto scrollbar" data-name="project__content">
      ${state.$isListView((value) =>
        value
          ? render(html`
              <div
                is-list
                keystring="id"
                class="w-fit p-2 flex flex-row items-start space-x-6"
                onMount=${init}
              >
                ${project.$lists((lists) =>
                  [...lists.map(List), form].map((item) => render(item))
                )}
              </div>
            `)
          : render(Calendar(id))
      )}
    </div>
  `;
};

export default Project;
