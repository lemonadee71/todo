import Component from '../helpers/component';
import Icons from './Icons';
import { format } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  let { id, title, desc, dueDate, completed } = task;

  return Component.parseString`
  <div id="${id}" class="task ${completed ? 'completed' : ''}" draggable="true">
    <div class="actions"> 
      <button ${{ onClick: onEdit }}>${Icons('edit')}</button>
      <button ${{ onClick: onDelete }}>${Icons('delete')}</button>
    </div>
    <div class="checkbox">
      <div ${{
        onClick: onToggle,
      }} class="check ${completed ? 'checked' : ''}">${Icons('checkmark')}</div>
    </div>
    <div class="brief-content">
      <div class="label-chips"></div>
      <p data-name="title-${task.id}">${title}</p>
      <div class="badges">
        <span data-name="desc-${task.id}" ${
    !desc ? 'style="display: none;"' : ''
  }>
        ${Icons('details')}
        </span>
        <span data-name="date-${task.id}" ${
    !dueDate ? 'style="display: none;"' : ''
  }>
        ${
          dueDate
            ? `${Icons('calendar')} <span>Due ${format(
                dueDate,
                'E, MMM dd'
              )}</span>`
            : ''
        }
        </span>        
      </div>
    </div>
  </div>  
  `;
};

export default TaskCard;
