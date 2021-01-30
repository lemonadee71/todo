import Component from '../component';
import Icons from './Icons';

const TaskCard = ({ id, onDelete, onEdit, toggleCheckmark }) => {
  return Component.parseString`
  <div id="${id}" "class="task" draggable="true">
    <div class="actions">
      <button>${Icons('edit')}</button>
      <button ${{ onClick: onDelete }}>${Icons('delete')}</button>
    </div>
    <div class="checkbox">
      <div ${{
        onClick: toggleCheckmark,
      }} class="check">${Icons('checkmark')}</div>
    </div>
    <div class="brief-content">
      <div class="label-chips"></div>
      <p>Title</p>
      <div class="badges"></div>
    </div>
  </div>  
  `;
};

export default TaskCard;
