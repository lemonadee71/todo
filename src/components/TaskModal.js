import Component from '../helpers/component';
import Icons from './Icons';

const TaskModal = () => {
  return Component.render(Component.parseString`
    <div class="title">
      <input
        type="text"
        name="title"
        class="light"
        placeholder="Unnamed Task"
      />
      <button>${Icons('edit')}</button>
    </div>
    <div class="proj">
      <span>in Project</span>
      <select name="project-list"></select>
    </div>
    <div class="labels">
      <div class="section-header">
        ${Icons('tag')}
        <span>Labels</span>
      </div>
      <button>+</button>
    </div>
    <div class="desc">
      <div class="section-header">
        ${Icons('details')}
        <span>Description</span>
      </div>
      <button>${Icons('edit')}</button>
      <textarea name="desc"></textarea>
    </div>
    <div class="date">
      <div class="section-header">
        ${Icons('calendar')}
        <span>Due Date</span>
      </div>
      <input type="date" name="dueDate" />
    </div>
  `);
};

export default TaskModal;
