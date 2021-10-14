import { createHook, html } from 'poor-man-jsx';
import { TASK } from '../core/actions';
import Core from '../core';

const Task = (data) => {
  const [task] = createHook({ isComplete: data.completed });

  const updateTask = (e) => {
    task.isComplete = e.target.checked;

    Core.event.emit(TASK.UPDATE, {
      project: data.project,
      list: data.list,
      task: data.id,
      data: {
        completed: task.isComplete,
      },
    });
  };

  const deleteTask = () => {
    Core.event.emit(TASK.REMOVE, { data });
  };

  return html`
    <div
      key="${data.id}"
      ${{ $class: task.$isComplete((val) => (val ? 'task--done' : 'task')) }}
    >
      <input
        type="checkbox"
        name="mark-as-done"
        id="cb-${data.id}"
        ${{ onChange: updateTask }}
      />
      <div class="task__body">
        <div class="task__labels"></div>
        <p class="task__title">
          <span class="task__name">${data.title}</span>
          <span class="task__number">${data.num}</span>
        </p>
        <div class="task__badges"></div>
      </div>
      <button ${{ onClick: deleteTask }}>Delete</button>
    </div>
  `;
};

export default Task;
