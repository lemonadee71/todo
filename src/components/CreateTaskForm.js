import Component from '../helpers/component.js';
import ProjectOptions from './ProjectOptions.js';
import {
  getProjectsDetails,
  getCurrentSelectedProj,
} from '../modules/projects';
import LabelPopover from './LabelPopover.js';

const CreateTaskForm = ({ onSubmit }) => {
  return Component.parseString`
    <form id="create-task" ${{ onSubmit }}>
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
      <div>
        <button>+</button>
        
      </div>

      <label for="task-notes" class="section-header">Notes</label>
      <textarea name="task-notes" data-id="new-task-notes"></textarea>

      <label for="task-due" class="section-header">Due Date</label>
      <input name="task-due" type="date" data-id="new-task-date" />
      <br/>
      <button class="submit" type="submit">Submit</button>
    </form>
  `;
};

export default CreateTaskForm;
