import Component from '../helpers/component';
import Icons from './Icons';
import { format } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  let { id, title, desc, dueDate, completed } = task;

  return Component.parseString`
  <div id="${id}" class="task ${completed ? 'completed' : ''}" draggable="true">
    <div class="actions"> 
      <button>${Icons('edit')}</button>
      <button ${{ onClick: onDelete }}>${Icons('delete')}</button>
    </div>
    <div class="checkbox">
      <div ${{
        onClick: onToggle,
      }} class="check ${completed ? 'checked' : ''}">${Icons('checkmark')}</div>
    </div>
    <div class="brief-content">
      <div class="label-chips"></div>
      <p>${title}</p>
      <div class="badges">
        ${desc ? Icons('details') : ''}
        ${
          dueDate
            ? `${Icons('calendar')} <span>Due ${format(
                dueDate,
                'E, MMM dd'
              )}</span>`
            : ''
        }
      </div>
    </div>
  </div>  
  `;
};

export default TaskCard;
