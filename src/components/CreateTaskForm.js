import Component from '../component.js';

const CreateTaskForm = () => {
  return Component.parseString`
  <form id="create-task">
    <input
      type="text"
      name="task name"
      id="new-task-name"
      placeholder="New Task"
    />
    <br />

    <p class="section-header">Description</p>
    <textarea
      name="task desc"
      id="new-task-desc"
    ></textarea>

    <p class="section-header">Due Date</p>
    <input type="date" />
    <br />
    
    <button type="submit">Submit</button>
  </form>
  `;
};

export default CreateTaskForm;
