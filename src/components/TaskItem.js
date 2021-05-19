import { html, createState } from '../helpers/component';
import { formatDate } from '../helpers/date';
import { completedTasks, currentTasks, modal } from '../helpers/selectors';
import $, { remove } from '../helpers/helpers';
import { CALENDAR_ICON, CHECKMARK, NOTES_ICON } from './Icons';
import TaskModal from './TaskModal';
import Chip from './Chip';
import event from '../modules/event';

const TaskItem = ({ taskData }) => {
  const task = createState(taskData);
  const { id, completed } = task.value;

  const editTask = () => {
    $(modal)
      .changeContent(TaskModal({ task: task.value }))
      .show();
  };

  const removeTask = () => {
    event.emit('task.delete', task.value);

    const list = task.value.completed ? completedTasks : currentTasks;
    remove($(`#${id}`)).from($(list));
  };

  const toggleCheckmark = (e) => {
    e.currentTarget.classList.toggle('checked');

    task.value.completed = !task.value.completed;
    event.emit('task.update', {
      info: task.value,
      data: {
        completed: task.value.completed,
      },
    });
  };

  return html`
    <div
      id="${id}"
      ${{
        $class: task.bind('completed', (val) =>
          val ? 'task completed' : 'task'
        ),
      }}
    >
      <div class="actions">
        <button is="edit-btn" ${{ onClick: editTask }}></button>
        <button is="delete-btn" ${{ onClick: removeTask }}></button>
      </div>
      <div class="checkbox">
        <div
          class="check ${completed ? 'checked' : ''}"
          ${{ onClick: toggleCheckmark }}
        >
          ${CHECKMARK}
        </div>
      </div>
      <div class="brief-content">
        <div class="label-chips">
          ${task.value.labels.map((label) => Chip({ label, clickable: true }))}
        </div>
        <p
          data-id="task-card-title"
          ${{
            $textContent: task.bind('title'),
          }}
        ></p>
        <div class="badges">
          <span
            data-id="task-card-notes"
            ${{
              $style: task.bind('notes', (notes) =>
                !notes ? 'display: none;' : ''
              ),
            }}
          >
            ${NOTES_ICON}
          </span>
          <span data-id="task-card-date">
            <span
              data-id="task-card-date-icon"
              ${{
                $style: task.bind('dueDate', (date) =>
                  !date ? 'display: none;' : ''
                ),
              }}
            >
              ${CALENDAR_ICON}
            </span>
            <span
              data-id="task-card-date-text"
              ${{
                $textContent: task.bind('dueDate', (date) =>
                  date ? formatDate(date) : ''
                ),
              }}
            >
            </span>
          </span>
        </div>
      </div>
    </div>
  `;
};

export default TaskItem;
