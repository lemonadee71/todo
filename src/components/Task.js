import { html } from 'poor-man-jsx';
import { TASK } from '../core/actions';
import Core from '../core';
import { $ } from '../utils/query';
import { createUndoFn } from '../utils/undo';
import TaskModal from './TaskModal';
import Chip from './Chip';

// data here points to the Task stored in main
// so we rely on the fact that changes are reflected on data
const Task = (data) => {
  const toggleComplete = (e) => {
    Core.event.emit(TASK.UPDATE, {
      project: data.project,
      list: data.list,
      task: data.id,
      data: {
        completed: e.target.checked,
      },
    });
  };

  const deleteTask = createUndoFn(
    `#${data.id}`,
    () =>
      Core.event.emit(TASK.REMOVE, {
        data: {
          project: data.project,
          list: data.list,
          id: data.id,
        },
      }),
    'Task removed'
  );

  const editTask = () => {
    $('#main-modal')
      .changeContent(TaskModal(data.project, data.list, data.id), 'task-modal')
      .show();
  };

  return html`
    <div
      id="${data.id}"
      key="${data.id}"
      data-project="${data.project}"
      data-list="${data.list}"
      class="${data.completed ? 'task--done' : 'task'}"
    >
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
  `;
};

export default Task;
