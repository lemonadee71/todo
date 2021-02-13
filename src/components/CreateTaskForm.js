import Component from '../helpers/component.js';
import ProjectOptions from './ProjectOptions.js';
import {
  getProjectsDetails,
  getCurrentSelectedProj,
} from '../modules/projects';
import { chipsWithText, newTaskFormLabels } from '../helpers/selectors';
import LabelPopover from './LabelPopover.js';
import Chip from './Chip';
import $, { append, remove } from '../helpers/helpers.js';

const CreateTaskForm = ({ onSubmit }) => {
  const addLabel = (label) => {
    if (label.selected) {
      append(
        Component.createElementFromString(
          Chip(label.id, label.color, label.name)
        )
      ).to($(newTaskFormLabels));
    } else {
      remove($(chipsWithText(label.id))).from($(newTaskFormLabels));
    }
  };

  const openLabelPopover = () => {
    $('#popover').classList.add('visible');
  };

  return Component.parseString`
    <div id="create-task">
      <input
        type="text"
        name="task-title"
        data-id="new-task-title"
        placeholder="New Task"
        required
      />
      
      <label for="task-location" class="section-header">Project</label>
      <select name="task-location" data-id="new-task-location">
        ${ProjectOptions(getProjectsDetails(), getCurrentSelectedProj())}
      </select>

      <label for="task-labels" class="section-header">Labels</label>
      <div id="form-labels">
        <button ${{ onClick: openLabelPopover }}>+</button>
        <div data-id="new-task-labels"></div>
        ${LabelPopover({ toggleLabel: addLabel })}
      </div>

      <label for="task-notes" class="section-header">Notes</label>
      <textarea name="task-notes" data-id="new-task-notes"></textarea>

      <label for="task-due" class="section-header">Due Date</label>
      <input name="task-due" type="date" data-id="new-task-date" />
      <br/>
      <button class="submit" ${{ onClick: onSubmit }}>Submit</button>
    </div>
  `;
};

export default CreateTaskForm;
