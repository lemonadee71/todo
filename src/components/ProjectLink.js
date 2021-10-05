import { html } from 'poor-man-jsx';
import Core from '../core';
import { PROJECT } from '../core/actions';

const ProjectLink = (data) => html`
  <li id="${data.id}">
    <a
      is="navigo-link"
      href="${`/app/${data.link}`}"
      title="Project | ${data.name}"
    >
      {% ${data.name} %}
    </a>
    <button ${{ onClick: () => Core.event.emit(PROJECT.REMOVE, data.id) }}>
      Delete
    </button>
  </li>
`;

export default ProjectLink;
