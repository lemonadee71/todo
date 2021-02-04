import Component from '../helpers/component';
import $, { clear, hide, rerender, show } from '../helpers/helpers';
import Icons from './Icons';
import { format } from 'date-fns';
import { Converter } from 'showdown';
import { uncategorizedTasks } from '../controller';

const options = {
  omitExtraWLInCodeBlocks: true,
  noHeaderId: true,
  ghCompatibleHeaderId: true,
  headerLevelStart: 2,
  parseImgDimensions: true,
  strikethrough: true,
  tables: true,
  ghCodeBlocks: true,
  tasklists: true,
  smartIndentationFix: true,
  simpleLineBreaks: true,
  openLinksInNewWindow: true,
  backslashEscapesHTMLTags: true,
  emoji: true,
};

const textToMarkdownConverter = new Converter(options);
textToMarkdownConverter.setFlavor('github');

const TaskModal = ({
  task,
  projects,
  updateTitle,
  updateLocation,
  updateDesc,
  updateDueDate,
}) => {
  const taskDesc = '--data-name=desc-area';

  const editTitle = (e) => {
    e.currentTarget.previousElementSibling.removeAttribute('disabled');
    hide(e.currentTarget);
  };

  const disableEdit = (e) => {
    show(e.currentTarget.nextElementSibling);
    e.currentTarget.setAttribute('disabled', '');
  };

  const editDesc = () => {
    $('--data-name=edit-desc-btn').classList.toggle('hidden');
    rerender($(taskDesc), descTextArea());
  };

  const saveDesc = () => {
    $('--data-name=edit-desc-btn').classList.toggle('hidden');
    updateDesc();
    rerender($(taskDesc), descriptionPreview());
  };

  const descTextArea = () =>
    Component.render(Component.parseString`
      <textarea id="edit-task-desc" "name="desc">${task.desc}</textarea>
      <button class="submit" type="submit" ${{ onClick: saveDesc }}>
        Save
      </button>  
  `);

  const projectList = projects.length
    ? [
        // Use an imported uncategorizedTasks for now
        {
          type: 'option',
          text: 'Uncategorized',
          attr: {
            disabled: 'true',
            selected: task.location === uncategorizedTasks.id ? 'true' : '',
          },
        },
        ...projects.map((proj) => ({
          type: 'option',
          text: proj.name,
          attr: {
            value: proj.id,
            selected: task.location === proj.id ? 'true' : '',
          },
        })),
      ]
    : '';

  const descriptionPreview = () =>
    Component.createElementFromObject({
      type: 'div',
      className: 'markdown-body',
      prop: {
        innerHTML: textToMarkdownConverter.makeHtml(task.desc),
      },
    });

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
        ${{ onChange: updateTitle, onFocusout: disableEdit }}
      />
      <button ${{ onClick: editTitle }}>${Icons('edit')}</button>
    </div>
    <div class="proj">
      <span>in Project</span>
      <select id="edit-task-location" name="location"
      ${{ onChange: updateLocation }}>
      ${projectList}
      </select>
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
      <button data-name="edit-desc-btn" ${{ onClick: editDesc }}>
        ${Icons('edit')}
      </button>
      <div data-name="desc-area">${descriptionPreview()}</div>
    </div>
    <div class="date">
      <div class="section-header">
        ${Icons('calendar')}
        <span>Due Date</span>
      </div>
      <input 
        type="date" 
        name="due-date" 
        ${task.dueDate ? `value="${format(task.dueDate, 'yyyy-MM-dd')}"` : ''} 
        ${{ onChange: updateDueDate }}
      />
    </div>
  `);
};

export default TaskModal;
