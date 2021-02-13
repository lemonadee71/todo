import Component from '../helpers/component.js';

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
      <br />

      <p class="section-header">Notes</p>
      <textarea name="task-notes" data-id="new-task-notes"></textarea>

      <p class="section-header">Due Date</p>
      <input type="date" data-id="new-task-date" />
      <br />

      <button class="submit" type="submit">Submit</button>
    </form>
  `;
};

export default CreateTaskForm;
