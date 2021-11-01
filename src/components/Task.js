import { html } from 'poor-man-jsx';
import { TASK } from '../core/actions';
import Core from '../core';
import { $ } from '../utils/query';
import { useUndo } from '../utils/undo';
import TaskModal from './TaskModal';
import Chip from './Chip';

// data here points to the Task stored in main
// so we rely on the fact that changes are reflected on data
const Task = (data, parent = '') => {
  const type = parent ? 'subtask' : 'task';
  const base = type === 'task' ? TASK : TASK.SUBTASKS;

  const toggleComplete = (e) => {
    Core.event.emit(base.UPDATE, {
      project: data.project,
      list: data.list,
      task: parent || data.id,
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
      Core.event.emit(base.REMOVE, {
        project: data.project,
        list: data.list,
        task: parent || data.id,
        subtask: data.id,
      }),
  });

  const editTask = () => {
    $('#main-modal').changeContent(TaskModal(data), 'task-modal').show();
  };

  return html`
    <div
      id="${data.id}"
      key="${data.id}"
      data-project="${data.project}"
      data-list="${data.list}"
      ${parent ? `data-parent="${parent}"` : ''}
      class="${data.completed ? `${type}--done` : type}"
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
      <div class="task__subtasks" is-list keystring="id">
        ${data.subtasks.items.map((subtask) => Task(subtask, data.id))}
      </div>
    </div>
  `;
};

export default Task;
