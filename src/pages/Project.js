import { html } from 'poor-man-jsx';
import List from '../components/List';
import Core from '../core';

// * This is is-list and should update for every new list
const Project = ({ data: { id } }) => {
  const project = Core.main.getProject(`project-${id}`);

  return html`
    <div>
      <h3>${project.name}</h3>
      <div>${project.lists.items.map((list) => List(list))}</div>
    </div>
  `;
};

export default Project;
