import Component from '../component.js';

const CreateTaskForm = ({ onSubmit }) => {
  return Component.parseString`
  <form id="create-task" ${{ onSubmit }}>
    <input
      type="text"
      name="task name"
      data-id="new-task-name"
      placeholder="New Task"
    />
    <br />

    <p class="section-header">Description</p>
    <textarea
      name="task desc"
      data-id="new-task-desc"
    ></textarea>

    <p class="section-header">Due Date</p>
    <input type="date" data-id="new-task-date"/>
    <br />
    
    <button type="submit">Submit</button>
  </form>
  `;
};

export default CreateTaskForm;
