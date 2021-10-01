import { createHook, html } from 'poor-man-jsx';
import List from '../components/List';
import Core from '../core';

// * This is is-list and should update for every new list
const Project = ({ data: { id } }) => {
  const data = Core.main.getProject(`project-${id}`);

  return html`
    <div>
      <h3>${data.name}</h3>
      <div>${data.lists.items.map((list) => List(list))}</div>
    </div>
  `;
};

export default Project;
