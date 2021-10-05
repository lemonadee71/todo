import { html, createState } from 'poor-man-jsx';
import { formatDate } from '../helpers/date';
import { completedTasks, currentTasks, modal } from '../helpers/selectors';
import $, { remove } from '../helpers/helpers';
import { CALENDAR_ICON, CHECKMARK, NOTES_ICON } from './Icons';
import TaskModal from './TaskModal';
import Chip from './Chip';
import { AppEvent } from '../emitters';

const TaskItem = ({ taskData }) => {
  const [task] = createState(taskData);
  const { id, completed } = task;

  const editTask = () => {
    $(modal).changeContent(TaskModal({ task })).show();
  };

  const removeTask = () => {
    AppEvent.emit('task.delete', task);

    const list = task.completed ? completedTasks : currentTasks;
    remove($(`#${id}`)).from($(list));
  };

  const toggleCheckmark = (e) => {
    e.currentTarget.classList.toggle('checked');

    task.completed = !task.completed;
    AppEvent.emit('task.update', {
      info: task,
      data: {
        completed: task.completed,
      },
    });
  };

  return html`
    <div
      id="${id}"
      ${{
        $class: task.$completed((val) => (val ? 'task completed' : 'task')),
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
          ${task.labels.map((label) => Chip({ label, expandable: true }))}
        </div>
        <p data-id="task-card-title" ${{ $textContent: task.$title }}></p>
        <div class="badges">
          <span
            data-id="task-card-notes"
            ${{
              $style: task.$notes((notes) => (!notes ? 'display: none;' : '')),
            }}
          >
            ${NOTES_ICON}
          </span>
          <span data-id="task-card-date">
            <span
              data-id="task-card-date-icon"
              ${{
                $style: task.$dueDate((date) =>
                  !date ? 'display: none;' : ''
                ),
              }}
            >
              ${CALENDAR_ICON}
            </span>
            <span
              data-id="task-card-date-text"
              ${{
                $textContent: task.$dueDate((date) =>
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
