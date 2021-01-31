import Component from '../helpers/component';
import Icons from './Icons';

const TaskCard = ({
  id,
  title,
  desc,
  dueDate,
  onEdit,
  onDelete,
  onToggle,
}) => {
  return Component.parseString`
  <div id="${id}" class="task" draggable="true">
    <div class="actions">
      <button>${Icons('edit')}</button>
      <button ${{ onClick: onDelete }}>${Icons('delete')}</button>
    </div>
    <div class="checkbox">
      <div ${{
        onClick: onToggle,
      }} class="check">${Icons('checkmark')}</div>
    </div>
    <div class="brief-content">
      <div class="label-chips"></div>
      <p>${title}</p>
      <div class="badges">
        ${desc ? Icons('details') : ''}
        ${dueDate ? Icons('calendar') : ''}
      </div>
    </div>
  </div>  
  `;
};

export default TaskCard;
