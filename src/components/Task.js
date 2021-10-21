import { createHook, html } from 'poor-man-jsx';
import { $ } from '../utils/query';
import { TASK } from '../core/actions';
import Core from '../core';
import TaskModal from './TaskModal';

const Task = (data) => {
  const [task] = createHook({ completed: data.completed });

  const updateTask = (e) => {
    task.completed = e.target.checked;

    Core.event.emit(TASK.UPDATE, {
      project: data.project,
      list: data.list,
      task: data.id,
      data: {
        completed: task.completed,
      },
    });
  };

  const deleteTask = () => {
    Core.event.emit(TASK.REMOVE, { data });
  };

  const editTask = () => {
    $('#main-modal')
      .changeContent(TaskModal(data.project, data.list, data.id), 'task-modal')
      .show();
  };

  return html`
    <div
      key="${data.id}"
      ${{ $class: task.$completed((val) => (val ? 'task--done' : 'task')) }}
    >
      <input
        type="checkbox"
        name="mark-as-done"
        ${{ checked: data.completed, onChange: updateTask }}
      />
      <div class="task__body">
        <div class="task__labels"></div>
        <p class="task__title">
          <span class="task__name">${data.title}</span>
          <span class="task__number">${data.numId}</span>
        </p>
        <div class="task__badges"></div>
      </div>
      <button ${{ onClick: deleteTask }}>Delete</button>
      <button ${{ onClick: editTask }}>Edit</button>
    </div>
  `;
};

export default Task;
