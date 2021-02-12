import Component from '../helpers/component';
import Icons from './Icons';
import { format } from 'date-fns';
import Chip from './Chip';

const TaskItem = ({ task, onEdit, onDelete, onToggle }) => {
  let { id, title, notes, dueDate, completed } = task;

  return Component.parseString`
  <div id="${id}" class="task ${completed ? 'completed' : ''}" draggable="true">
    <div class="actions"> 
      <button ${{ onClick: onEdit }}>${Icons('edit')}</button>
      <button ${{ onClick: onDelete }}>${Icons('delete')}</button>
    </div>
    <div class="checkbox">
      <div class="check ${completed ? 'checked' : ''}" 
      ${{ onClick: onToggle }}>
      ${Icons('checkmark')}
      </div>
    </div>
    <div class="brief-content">
      <div class="label-chips">
        ${task.getLabels().map((label) => Chip(label.name, label.color))}
      </div>
      <p data-id="task-card-title">${title}</p>
      <div class="badges">
        <span data-id="task-card-notes" 
        ${!notes ? 'style="display: none;"' : ''}>
        ${Icons('details')}
        </span>
        <span data-id="task-card-date">
          <span data-id="task-card-date-icon"
          ${!dueDate ? 'style="display: none;"' : ''}>
          ${Icons('calendar')}
          </span>
          <span data-id="task-card-date-text">
          ${dueDate ? `${format(dueDate, 'E, MMM dd')}` : ''}
          </span>
        </span>        
      </div>
    </div>
  </div>  
  `;
};

export default TaskItem;
