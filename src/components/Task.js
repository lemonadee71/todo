import Sortable from 'sortablejs';
import { html } from 'poor-man-jsx';
import { TASK } from '../core/actions';
import Core from '../core';
import { $ } from '../utils/query';
import { useUndo } from '../utils/undo';
import TaskModal from './TaskModal';
import Chip from './Chip';

// data here points to the Task stored in main
// so we rely on the fact that changes are reflected on data
const Task = (data) => {
  const getType = () => (data.parentTask ? 'subtask' : 'task');
  const getBase = () => (data.parentTask ? TASK.SUBTASKS : TASK);

  const toggleComplete = (e) => {
    Core.event.emit(getBase().UPDATE, {
      project: data.project,
      list: data.list,
      task: data.parentTask || data.id,
      subtask: data.id,
      data: {
        completed: e.target.checked,
      },
    });
  };

  const deleteTask = useUndo({
    element: `#${data.id}`,
    text: 'Task removed',
    callback: () =>
      Core.event.emit(getBase().REMOVE, {
        project: data.project,
        list: data.list,
        task: data.parentTask || data.id,
        subtask: data.id,
      }),
  });

  const editTask = () => {
    $('#main-modal').changeContent(TaskModal(data), 'task-modal').show();
  };

  const transferSubtask = (action, fromTask, fromList, subtaskId, position) => {
    Core.event.emit(action, {
      project: data.project,
      list: { to: data.list, from: fromList },
      task: { to: data.id, from: fromTask },
      subtask: subtaskId,
      type: 'task',
      data: { position },
    });
  };

  const moveSubtask = (id, position) => {
    Core.event.emit(TASK.SUBTASKS.MOVE, {
      project: data.project,
      list: data.list,
      task: data.id,
      subtask: id,
      data: { position },
    });
  };

  const initSubtasks = function () {
    if (data.parentTask) return;

    Sortable.create(this, {
      group: 'tasks',
      animation: 150,
      delay: 10,
      draggable: '.subtask',
      filter: 'input,button',
      onUpdate: (e) => moveSubtask(e.item.id, e.newIndex),
      onAdd: (e) => {
        const isSubtask = !!e.item.dataset.parent;
        const fromTask = e.item.dataset.parent || e.item.id;
        const fromList = e.item.dataset.list;
        const action = isSubtask ? TASK.SUBTASKS.TRANSFER : TASK.TRANSFER;

        transferSubtask(action, fromTask, fromList, e.item.id, e.newIndex);
      },
    });
  };

  return html`
    <div
      id="${data.id}"
      key="${data.id}"
      class="${data.completed ? `${getType()}--done` : getType()}"
      data-project="${data.project}"
      data-list="${data.list}"
      ${data.parentTask ? `data-parent="${data.parentTask}"` : ''}
    >
      <div class="task__main">
        <input
          class="task__checkbox"
          type="checkbox"
          name="mark-as-done"
          ${data.completed ? 'checked' : ''}
          ${{ onChange: toggleComplete }}
        />
        <div class="task__body">
          <div class="task__labels" is-list>
            ${data.labels.items.map((label) => Chip(label))}
          </div>
          <div class="task__title">
            <p class="task__name">${data.title}</p>
            <span class="task__number">#${data.numId}</span>
          </div>
          <div class="task__badges"></div>
        </div>
        <div class="task__menu">
          <button ${{ onClick: deleteTask }}>Delete</button>
          <button ${{ onClick: editTask }}>Edit</button>
        </div>
      </div>
      <div
        class="task__subtasks"
        is-list
        keystring="id"
        ${{ '@create': initSubtasks }}
      >
        ${data.subtasks.items.map((subtask) => Task(subtask, data.id))}
      </div>
    </div>
  `;
};

export default Task;
