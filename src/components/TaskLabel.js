import { html } from 'poor-man-jsx';

const TaskLabel = (data) => html`
  <div
    key="${data.id}"
    class="task-label"
    style="background-color: ${data.color};"
  >
    <span>{% ${data.name} %}</span>
  </div>
`;

export default TaskLabel;
