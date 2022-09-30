import PoorManJSX, { html } from 'poor-man-jsx';
import { EDIT_SUBTASK, EDIT_TASK } from '../actions';
import Core from '../core';
import { useUndo } from '../utils/undo';
import DateBadge from '../components/DateBadge';

const BaseTask = ({ children, props }) => {
  const { action, badges, data, template: _template, position } = props;
  const { type, id, title, labels, completed } = data;

  const editTask = () => {
    Core.event.emit(type === 'task' ? EDIT_TASK : EDIT_SUBTASK, data);
  };

  const deleteTask = useUndo({
    type: action,
    message: `${type[0].toUpperCase() + type.slice(1)} removed`,
    data: { ...data.location, id },
  });

  const handleKeydown = (e) => {
    if (e.altKey || e.eventPhase !== 2) return;

    switch (e.key) {
      case 'Enter':
        editTask();
        e.preventDefault();
        break;
      case 'Delete':
      case 'Backspace':
        deleteTask();
        e.preventDefault();
        break;
      default:
    }
  };

  const toggleComplete = () => {
    Core.event.emit(action.UPDATE, {
      ...data.location,
      data: { completed: null },
    });
  };

  const template = {
    ..._template,
    main: {
      'data-location': Object.values(data.location).join('-'),
      'data-position': position,
      sortable: { action: action.MOVE, getData: () => data.location },
      onKeydown: handleKeydown,
      ...(_template.main || {}),
    },
  };

  return html`
    <task-template
      type=${type}
      id=${id}
      title=${title}
      completed=${completed}
      labels=${labels}
      badges=${[DateBadge({ props: { data } }), ...badges]}
      template=${template}
    >
      <label
        :slot="before_main"
        class="relative cursor-pointer select-none focus-within:ring"
      >
        <span class="sr-only"> Mark ${type} as complete </span>
        <input
          class="absolute w-0 h-0 opacity-0 peer"
          type="checkbox"
          name="mark-as-done"
          checked=${completed}
          onClick=${toggleComplete}
        />
        <div
          class="peer-focus:ring box-border flex justify-center items-center bg-slate-100 rounded-sm border border-solid border-gray-400 dark:bg-transparent dark:border-white"
          ${template.checkbox}
        >
          <div
            class="rounded-sm bg-cyan-500 hover:opacity-80 dark:bg-[#208DA5]"
            class:[visible|invisible]=${completed}
            ${template.checkmark}
          ></div>
        </div>
      </label>

      <div :slot="after_main" ${template.menu}>
        <dropdown-wrapper name=${type} placement="left">
          <button :slot="button">
            <my-icon
              name="kebab"
              id="taskmenu-${id}"
              title="Task menu"
              class="stroke-gray-500 hover:stroke-gray-800 dark:hover:stroke-gray-300"
            />
          </button>

          <div
            :slot="dropdown"
            :skip="class"
            class="flex flex-col text-center text-white text-sm py-1 space-y-1 rounded divide-y divide-gray-500   bg-neutral-700 border border-solid border-gray-500 drop-shadow z-20"
          >
            <button
              class="px-2 hover:text-blue-400"
              aria-haspopup="dialog"
              onClick=${editTask}
            >
              Edit
            </button>
            <button class="px-2 hover:text-red-600" onClick=${deleteTask}>
              Delete
            </button>
          </div>
        </dropdown-wrapper>
      </div>

      ${children}
    </task-template>
  `;
};

PoorManJSX.customComponents.define('base-task', BaseTask);
