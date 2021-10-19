import { createHook, html } from 'poor-man-jsx';
import { $ } from '../utils/query';
import { TASK } from '../core/actions';
import Core from '../core';
import TaskModal from './TaskModal';

const Task = (data) => {
  const [task] = createHook({ ...data });

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
      .changeContent(TaskModal(task.project, task.list, task.id), 'task-modal')
      .show();
  };

  return html`
    <div
      key="${task.id}"
      ${{ $class: task.$completed((val) => (val ? 'task--done' : 'task')) }}
    >
      <input
        type="checkbox"
        name="mark-as-done"
        id="cb-${task.id}"
        ${{ checked: task.isComplete }}
        ${{ onChange: updateTask }}
      />
      <div class="task__body">
        <div class="task__labels"></div>
        <div class="task__title">
          <p class="task__name">${task.title}</p>
          <p class="task__number">${task.numId}</p>
        </div>
        <div class="task__badges"><p>${task.notes ? 'Has notes' : ''}</p></div>
      </div>
      <button ${{ onClick: deleteTask }}>Delete</button>
      <button ${{ onClick: editTask }}>Edit</button>
    </div>
  `;
};

export default Task;
