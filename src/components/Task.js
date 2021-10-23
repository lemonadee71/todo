import { html, render } from 'poor-man-jsx';
import { $ } from '../utils/query';
import { TASK } from '../core/actions';
import Core from '../core';
import TaskModal from './TaskModal';
import { cancellable } from '../utils/delay';
import { showToast } from '../utils/showToast';

const Task = (data) => {
  const getLocationData = () => {
    const taskItem = $.attr('key', data.id);

    return {
      id: data.id,
      project: taskItem.dataset.project,
      list: taskItem.dataset.list,
    };
  };

  const updateTask = (e) => {
    Core.event.emit(TASK.UPDATE, {
      project: data.project,
      list: data.list,
      task: data.id,
      data: {
        completed: e.target.checked,
      },
    });
  };

  const deleteTask = () => {
    const [_delete, _cancelDelete] = cancellable(
      () => Core.event.emit(TASK.REMOVE, { data: getLocationData() }),
      3000
    );

    $.attr('key', data.id).style.display = 'none';
    _delete();

    const toast = showToast({
      node: render(
        html`
          <div style="display: flex;">
            <p>Task removed</p>
            <button
              ${{
                onClick: () => {
                  const taskItem = $.attr('key', data.id);
                  if (taskItem) {
                    taskItem.style.display = 'flex';
                  }

                  _cancelDelete();
                  toast.hideToast();
                },
              }}
            >
              Undo
            </button>
          </div>
        `
      ).firstElementChild,
    });
  };

  const editTask = () => {
    const location = getLocationData();

    $('#main-modal')
      .changeContent(
        TaskModal(location.project, location.list, location.id),
        'task-modal'
      )
      .show();
  };

  return html`
    <div
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
        ${{ onChange: updateTask }}
      />
      <div class="task__body">
        <div class="task__labels"></div>
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
