import Component from '../helpers/component';
import { formatDate } from '../helpers/date';
import { completedTasks, currentTasks, modal } from '../helpers/selectors';
import $, {
  append,
  changeModalContent,
  remove,
  show,
} from '../helpers/helpers';
import { deleteTask } from '../modules/projects';
import Storage from '../modules/storage';
import Icons from './Icons';
import Chip from './Chip';
import TaskModal from '../components/TaskModal';

const TaskItem = ({ task }) => {
  const taskState = Component.createState(task);
  let { id, notes, dueDate, completed } = taskState.value;

  /*
   *  Wrapper functions
   */
  const _syncData = () => Storage.sync('data');

  const _deleteTask = (task) => deleteTask(task);

  const _toggleCheck = () => {
    task.toggleComplete();
    _syncData();

    return task.completed;
  };

  /*
   *  Event listeners
   */
  const onEdit = () => {
    changeModalContent(TaskModal({ task: taskState.value }));
    show($(modal));
  };

  const onDelete = () => {
    _deleteTask(task);

    let list = task.completed ? completedTasks : currentTasks;
    remove($(`#${id}`)).from($(list));
  };

  const toggleCheckmark = (e) => {
    e.currentTarget.classList.toggle('checked');

    let isDone = _toggleCheck();
    let taskCard = $(`#${id}`);
    taskCard.classList.toggle('completed');

    if (isDone) {
      append(taskCard).to($(completedTasks));
    } else {
      append(taskCard).to($(currentTasks));
    }
  };

  return Component.html`
    <div id="${id}" class="task ${completed ? 'completed' : ''}"
      draggable="true">
      <div class="actions"> 
        <button ${{ onClick: onEdit }}>${Icons('edit')}</button>
        <button ${{ onClick: onDelete }}>${Icons('delete')}</button>
      </div>
      <div class="checkbox">
        <div class="check ${completed ? 'checked' : ''}" 
        ${{ onClick: toggleCheckmark }}>
        ${Icons('checkmark')}
        </div>
      </div>
      <div class="brief-content">
        <div class="label-chips">
          ${task.getLabels().map((label) => Chip(label.id, label.color))}
        </div>
        <p data-id="task-card-title" ${{
          $textContent: taskState.bind('title'),
        }}></p>
        <div class="badges">
          <span data-id="task-card-notes" ${{
            '$style:display': taskState.bind('notes', (notes) =>
              !notes ? 'none' : ''
            ),
          }}
          >
          <!-- ${!notes ? 'style="display: none;"' : ''} -->
          ${Icons('details')}
          </span>
          <span data-id="task-card-date">
            <span data-id="task-card-date-icon" ${{
              '$style:display': taskState.bind('dueDate', (date) =>
                date ? 'none' : ''
              ),
            }}
            >
            <!-- ${!dueDate ? 'style="display: none;"' : ''} -->
              ${Icons('calendar')}
            </span>
            <span data-id="task-card-date-text" ${{
              $textContent: taskState.bind('dueDate', (date) =>
                date ? `${formatDate(date)}` : ''
              ),
            }}>
            <!-- ${dueDate ? `${formatDate(dueDate)}` : ''} -->
            </span>
          </span>        
        </div>
      </div>
    </div>  
  `;
};

export default TaskItem;
