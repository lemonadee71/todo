import Component from '../helpers/component';
import $, { hide, show } from '../helpers/helpers';
import Icons from './Icons';
import { format } from 'date-fns';

const TaskModal = ({
  task,
  projects,
  updateTitle,
  updateLocation,
  updateDesc,
  updateDueDate,
}) => {
  const allowEditing = (e) => {
    $('div.title input[name="title"]').removeAttribute('disabled');
    hide($('div.title button'));
  };

  const disableEditing = () => {
    show($('div.title button'));
    $('div.title input[name="title"]').setAttribute('disabled', '');
  };

  return Component.render(Component.parseString`
    <div class="title">
      <input
        type="text"
        name="title"
        class="light"
        placeholder="Unnamed Task"
        value="${task.title}"
        disabled
        required
        ${{ onChange: updateTitle, onFocusout: disableEditing }}
      />
      <button ${{ onClick: allowEditing }}>${Icons('edit')}</button>
    </div>
    <div class="proj">
      <span>in Project</span>
      <select name="project-list" ${{ onChange: updateLocation }}>${
    projects.length
      ? projects.map((proj) =>
          Component.createElementFromObject({
            type: 'option',
            text: proj.name,
            attr: {
              value: proj.id,
            },
          })
        )
      : ''
  }</select>
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
      <textarea name="desc" ${{
        onKeydown: updateDesc,
        onFocusout: updateDesc,
      }}>${task.desc}</textarea>
    </div>
    <div class="date">
      <div class="section-header">
        ${Icons('calendar')}
        <span>Due Date</span>
      </div>
      <input type="date" name="dueDate" ${
        task.dueDate ? `value="${format(task.dueDate, 'yyyy-MM-dd')}"` : ''
      } ${{ onChange: updateDueDate }}/>
    </div>
  `);
};

export default TaskModal;
