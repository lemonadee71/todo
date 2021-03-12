import Component from '../helpers/component';
import { formatDate } from '../helpers/date';
import { completedTasks, currentTasks, modal } from '../helpers/selectors';
import $, { append, remove } from '../helpers/helpers';
import { deleteTask } from '../modules/projects';
import Storage from '../modules/storage';
import { CALENDAR_ICON, CHECKMARK, NOTES_ICON } from './Icons';
import TaskModal from './TaskModal';
import Chip from './Chip';

const TaskItem = ({ task }) => {
  const taskState = Component.createState(task);
  const { id, completed } = taskState.value;

  /*
   *  Wrapper functions
   */
  const _syncData = () => Storage.sync('data');

  const _deleteTask = (task) => deleteTask(task);

  const _toggleCheck = () => {
    taskState.value.toggleComplete();
    _syncData();

    return taskState.value.completed;
  };

  /*
   *  Event listeners
   */
  const editTask = () => {
    $(modal)
      .changeContent(TaskModal({ task: taskState.value }))
      .show();
  };

  const removeTask = () => {
    _deleteTask(taskState.value);

    let list = taskState.value.completed ? completedTasks : currentTasks;
    remove($(`#${id}`)).from($(list));
  };

  const toggleCheckmark = (e) => {
    e.currentTarget.classList.toggle('checked');

    let isDone = _toggleCheck();
    let list = isDone ? completedTasks : currentTasks;
    let taskCard = $(`#${id}`);
    taskCard.classList.toggle('completed');

    append(taskCard).to($(list));
  };

  return Component.html`
    <div id="${id}" class="task ${completed ? 'completed' : ''}"
      draggable="true">
      <div class="actions"> 
        <button is="edit-btn" ${{ onClick: editTask }}></button>
        <button is="delete-btn" ${{ onClick: removeTask }}></button>
      </div>
      <div class="checkbox">
        <div class="check ${completed ? 'checked' : ''}" 
        ${{ onClick: toggleCheckmark }}>
          ${CHECKMARK}
        </div>
      </div>
      <div class="brief-content">
        <div class="label-chips">
          ${taskState.value
            .getLabels()
            .map((label) => Chip({ label, clickable: true }))}
        </div>
        <p data-id="task-card-title" ${{
          $textContent: taskState.bind('title'),
        }}></p>
        <div class="badges">
          <span data-id="task-card-notes" ${{
            $style: taskState.bind('notes', (notes) =>
              !notes ? 'display: none;' : ''
            ),
          }}
          >
          ${NOTES_ICON}
          </span>
          <span data-id="task-card-date">
            <span data-id="task-card-date-icon" ${{
              $style: taskState.bind('dueDate', (date) =>
                !date ? 'display: none;' : ''
              ),
            }}
            >
              ${CALENDAR_ICON}
            </span>
            <span data-id="task-card-date-text" ${{
              $textContent: taskState.bind('dueDate', (date) =>
                date ? formatDate(date) : ''
              ),
            }}>
            </span>
          </span>        
        </div>
      </div>
    </div>  
  `;
};

export default TaskItem;
